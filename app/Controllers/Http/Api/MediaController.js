'use strict'

const Helpers = use('Helpers')
const uuidv4 = require("uuid/v4");
// const { validate } = use('Validator');

class MediaController {

  async upload({request, response}) {

    const validationOptions = JSON.parse(request.input('validations', '{}'));
    // const validationOptions = {
    //   types: ['image'],
    //   size: '1mb',
    //   extnames: ['jpg', 'png', 'gif']
    // }

    const uploadedFile = request.file('file', validationOptions)
  
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

      // Example validation response
      // {
      //   fieldName: "field_name",
      //   clientName: "invalid-file-type.ai",
      //   message: "Invalid file type postscript or application. Only image is allowed",
      //   type: "type"
      // }
      // {
      //   fieldName: "field_name",
      //   clientName: "invalid-file-size.png",
      //   message: "File size should be less than 2MB",
      //   type: "size"
      // }

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
