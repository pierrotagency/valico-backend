'use strict'

const Helpers = use('Helpers')

// const { validate } = use('Validator');

class MediaController {

  async upload({request, response}) {
    
    const uploadedFile = request.file('file', {
      types: ['image'],
      size: '2mb'
    })
  
    await uploadedFile.move(Helpers.tmpPath('uploads'), {
      name: 'custom-name.jpg',
      overwrite: true
    })
  
    if (!uploadedFile.moved()) {
      return uploadedFile.error()
    }

    return 'File moved'

  }

}

module.exports = MediaController
