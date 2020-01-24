'use strict'

const Helpers = use('Helpers')
const uuidv4 = require("uuid/v4");
const { validate } = use('Validator');
const { safeParseJSON, gatMetaFilename, parseMetaFilename, getTodayISO } = use('App/Helpers')
const sharp = require('sharp');
const Drive = use('Drive')

class MediaController {

  
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

    // let fields = request.only(['_validations'])
    //     fields.fileobj = request.file('fileobj')

    // let validations = {object:{},messages:{}}
    // if(fields._validations){
    //   validations = safeParseJSON(fields._validations) // it might come as a JSON (if regular post) or as a stringified JSON if lone ajax
    //   delete fields._validations;
    // }

    // // TODO ****** custom validation menssages not working yet (only for FILE UPLOAD)    
    // const validation = await validate(fields, validations.objects, validations.messages)
    // if (validation.fails()) return response.status(422).send(validation.messages());


    // const uploadedFile = fields.fileobj

    request.multipart.file('fileobj', {}, async (file) => {


      const serverName = gatMetaFilename(file.clientName, {
        // size: file.size, // i dont have4 autoprocess so i don't know the filesize
        type: file.type
      })

      const serverPath = `${getTodayISO()}/${serverName}`

      await Drive.disk('storage').put(serverPath, file.stream)
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

    //   // const storage = await Drive.disk('storage').get('test.jpg')
    //   // console.log(storage)

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

    //   return response.json(parseMetaFilename(serverName))

    // }

  }

}

module.exports = MediaController