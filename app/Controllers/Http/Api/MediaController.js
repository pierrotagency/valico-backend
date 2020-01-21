'use strict'

const Helpers = use('Helpers')

// const { validate } = use('Validator');

class MediaController {

  async upload({request, response}) {
    

    const validationOptions = {
      types: ['image'],
      size: '2mb',
      extnames: ['jpg', 'png', 'gif']
    }

    const uploadedFile = request.file('file', validationOptions)
  
    console.log(uploadedFile.clientName)
    console.log(uploadedFile.extname)
    console.log(uploadedFile.size)
    console.log(uploadedFile.type)

    const serverName = 'custom-name.jpg';

    await uploadedFile.move(Helpers.tmpPath('uploads'), {
      name: serverName,
      overwrite: true
    })
  
    if (!uploadedFile.moved()) {      
      return response.status(422).send(uploadedFile.error());
    }
    else{
      return response.json({
        uploadedFile: serverName
      })
    }


  }

}

module.exports = MediaController
