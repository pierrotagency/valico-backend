'use strict'

const Helpers = use('Helpers')
const uuidv4 = require("uuid/v4");
const { validate } = use('Validator');
const { safeParseJSON } = use('App/Helpers')
const sharp = require('sharp');

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

    let originalName = uploadedFile.clientName.replace(/\.[^/.]+$/, "") // remove extension
        originalName = originalName.replace('_','-') // if the name has underscores, replace it, so we can use _ later to parse the file name
    
    const uuid = uuidv4();
    const type = uploadedFile.type;
    const size = uploadedFile.size;
    const ext = uploadedFile.extname.toLowerCase();
    const serverName =  `${uuid}__${originalName}__${type}__${size}.${ext}`;

    await uploadedFile.move(Helpers.tmpPath('uploads'), {
      name: serverName,
      overwrite: true
    })
  
    if (!uploadedFile.moved()) {      
      return response.status(422).send(uploadedFile.error());
    }
    else{

      // OK UPLOADED 

      return response.json({
        path: serverName,
        name: `${originalName}.${ext}`,
        size: size,
        type: type,
        ext: ext,
        uuid: uuid
      })
    }

  }


  async uploadImage({request, response}) {

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

    let originalName = uploadedFile.clientName.replace(/\.[^/.]+$/, "") // remove extension
        originalName = originalName.replace('_','-') // if the name has underscores, replace it, so we can use _ later to parse the file name
    
    const uuid = uuidv4();
    const type = uploadedFile.type;
    const size = uploadedFile.size;
    const ext = uploadedFile.extname.toLowerCase();
    const serverName =  `${uuid}__${originalName}__${type}__${size}.${ext}`;

    await uploadedFile.move(Helpers.tmpPath('uploads'), {
      name: serverName,
      overwrite: true
    })


    // console.log(uploadedFile);
  
    if (!uploadedFile.moved()) {      
      return response.status(422).send(uploadedFile.error());
    }
    else{


      const outputFile = Helpers.tmpPath('uploads') + '/resizeddddd.jpg' 

      const inputFile = Helpers.tmpPath('uploads') + '/' + serverName

      console.log(inputFile)

      sharp(inputFile).resize({ height: 780 }).toFile(outputFile)
      .then(function(newFileInfo) {

        
          // newFileInfo holds the output file properties
          console.log("Success")

          console.log(newFileInfo)
          
      })
      .catch(function(err) {
          console.log("Error occured");

          console.log(err)
      });

      // OK UPLOADED 

      return response.json({
        path: serverName,
        name: `${originalName}.${ext}`,
        size: size,
        type: type,
        ext: ext,
        uuid: uuid
      })
    }

  }

}

module.exports = MediaController