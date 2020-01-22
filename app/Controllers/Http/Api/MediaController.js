'use strict'

const Helpers = use('Helpers')
const uuidv4 = require("uuid/v4");
const { validate } = use('Validator');
const { safeParseJSON } = use('App/Helpers')

class MediaController {

  
  async uploadFile({request, response}) {

    let fields = request.only(['_validations'])
        fields.fileobj = request.file('fileobj')

    let validations = {object:{},messages:{}}
    if(fields._validations){
      validations = safeParseJSON(fields._validations)
      delete fields._validations;
    }
    
    // console.log(validations)
    // console.log(fields)

    // const validations = {         
    //   file: 'required|file|file_ext:pdf,doc|file_size:5mb'
    // }
    //   const messages = {
    //     'file.required': 'Requiiiired'
    // }

    
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

    let params = request.only(['validations'])
        params.file = request.file('file')

    const validations = JSON.parse(params.validations)
    // const validations = {         
    //   file: 'required|file|file_ext:png,gif,jpg,jpeg,tiff,bmp|file_size:1mb|file_types:image'
    // }
    const validation = await validate(params, validations)
    if (validation.fails()) return response.status(422).send(validation.messages());


    const uploadedFile = params.file

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

}

module.exports = MediaController
