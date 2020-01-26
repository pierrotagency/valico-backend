const Helpers = use('Helpers')
const uuidv4 = require("uuid/v4");
const { validate } = use('Validator');
const { safeParseJSON, gatMetaFilename, parseMetaFilename, getTodayISO } = use('App/Helpers')
const sharp = require('sharp');
const fs = require('fs');
const Drive = use('Drive')

class StorageController {

  
  async uploadFile({request, response}) {

    let fields = request.only(['_validations'])
        fields.fileobj = request.file('fileobj')

    let validations = {object:{},messages:{}}
    if(fields._validations){
      validations = safeParseJSON(fields._validations) // it might come as a JSON (if regular post) or as a stringified JSON if lone ajax
      delete fields._validations;
    }

    // TODO ****** custom validation menssages not working yet (only for FILE UPLOAD)    
    const validation = await validate(fields, validations.objects, validations.messages)
    if (validation.fails()) return response.status(422).send(validation.messages());


    const uploadedFile = fields.fileobj

    const serverName = gatMetaFilename(uploadedFile.clientName, {
      size: uploadedFile.size,
      type: uploadedFile.type
    })

    await uploadedFile.move(Helpers.tmpPath('uploads'), {
      name: serverName,
      overwrite: true
    })
  
    if (!uploadedFile.moved()) {      
      return response.status(422).send(uploadedFile.error());
    }
    else{

      // OK UPLOADED 

      return response.json(parseMetaFilename(serverName))
    }

  }


  async uploadImage({request, response}) {
    // AdonisJS processManually exception on this route https://adonisjs.com/docs/4.0/file-uploads#_process_inside_the_controller

    let validations = {objects:{},messages:{}}
    if(request.header('X-Validate')){
      validations = JSON.parse(request.header('X-Validate')) 
    }


    request.multipart.file('fileobj', validations.objects, async (file) => {

      file.size = file.stream.byteCount

      await file.runValidations()

      const error = file.error()
      if (error.message) {
        // throw new Error(error.message)
        return response.status(422).send(error.message);
      }
      
      const serverName = gatMetaFilename(file.clientName, {
        size: file.size,
        type: file.type
      })

      const serverPath = `${getTodayISO()}/${serverName}`

      await Drive.disk('storage').put(serverPath, file.stream)

      return response.json({ ...{path: serverPath}, ...parseMetaFilename(serverName) })

    })

    await request.multipart.process()

    // await uploadedFile.move(Helpers.tmpPath('uploads'), {
    //   name: serverName,
    //   overwrite: true
    // })


    
    // if (!uploadedFile.moved()) {      
    //   return response.status(422).send(uploadedFile.error());
    // }
    // else{

    //   const outputFile = Helpers.tmpPath('uploads') + '/resizeddddd.jpg' 
    //   const inputFile = Helpers.tmpPath('uploads') + '/' + serverName

    //   sharp(inputFile).resize({ height: 780 }).toFile(outputFile)
    //   .then(function(newFileInfo) {
    //       console.log("Success")
    //       console.log(newFileInfo)
    //   })
    //   .catch(function(err) {
    //       console.log("Error occured");
    //       console.log(err)
    //   });

    //   // OK UPLOADED 

      // return response.json(parseMetaFilename(serverName))

    // }

  }




  async getImage({request, response, params}) {
      
    const storage = params.storage ? params.storage : 'storage';
    const imageUri = `${params.catalog}/${params.file}`
    const query = request.all()

    const format = query.format ? query.format : 'jpg';
    const width = query.width ? parseInt(query.width) : 480;
    const height = query.height ? parseInt(query.height) : 480;
    const position = query.position ? parseInt(query.position) : 'centre';
    const quality = query.quality ? parseInt(query.quality) : 85;
    const fit = query.fit ?  query.fit : 'inside';

    response.implicitEnd = false

    try {

      // the order of params DOES MATTER (for cache recognition)
      const resFilename = gatMetaFilename(params.file, query, true, [])
      const resUri = `${params.catalog}/_${resFilename}`

      if(!query._noCache){
        // handle already existing resizes
        const resExists = await Drive.disk(storage).exists(resUri);
        if(resExists){

          const image = await Drive.disk(storage).get(resUri)
          const originalExt = params.file.split('.').pop()
          
          response.type(`image/${originalExt}`);
          return response.send(image);      
        }
      }
      
      const tmpFile = Helpers.tmpPath('resizing') + `/${uuidv4()}.${format}`

      const exists = await Drive.disk(storage).exists(imageUri);
      if(!exists){
        return response.status(404).send(`Image [${imageUri}] not found in [${storage}]`);      
      }

      const inStream = Drive.disk(storage).getStream(imageUri);      
            inStream.on('error', function(err) {
              console.log('InStream ERROR')
              console.log(err)          
            });
      
      const outStream = fs.createWriteStream(tmpFile, {flags: "w"});
          outStream.on('error', function(err) {
              console.log("outStream Error");
              console.log(err)
          });
          outStream.on('close', function() {
              
              // response the resized image, put the resized into cache file, and delete de tmp image
              fs.readFile(tmpFile, {}, function(err,data){
                  if (!err) {
                      
                      Drive.disk(storage).put(resUri, data)

                      fs.unlink(tmpFile,() =>{
                        // console.log('delete tmp')
                      })

                      response.type(`image/${format}`);
                      response.send(data) 
                      response.end()   
                      
                  } else {
                      console.log(err);
                  }
              });

          });
          outStream.on('finish', function() {       
          });

      // let transform = sharp()
      //               .resize({ width: 711, height: 400 })
      //               .on('info', function(fileInfo) {
      //                   console.log("Resizing done, file not saved");
      //                   console.log(fileInfo)
      //               }).toBuffer(function(err, data,info){
      //                 console.log('buffffffffer')
      //                 // response.send(data) 
      //                 // response,end()
      //             })

      const transform = sharp().resize({ 
          width: width,
          height: height,
          fit: fit,
          position: position
      }).toFormat(format, {
          quality: quality
      });

    
      inStream.pipe(transform).pipe(outStream);

    
    } catch (error) {
      // console.log(error)
      response.type('application/json');
      return response.status(500).send({message: error.message});      
    }

    
  }



}

module.exports = StorageController