'use strict'

class UpdatePost {
  
  get rules () {
    
    const objectId = this.ctx.params.id //is always ID, not UUID

    return {
      name: `required|min:6`,
      slug: `required|unique:posts,slug,uuid,${objectId}`
    }

  }

  get messages () {
    return {
      'name.required': 'You must provide a name',
      'name.min': 'You must provide a longer name.',
      'slug.required': 'This slug is required.',
      'slug.unique': 'The slug is already being used by another post'
    }
  }

  get validateAll () {
    return true
  }

  // get sanitizationRules () {
  //   return {
  //     email: 'normalize_email',
  //     age: 'to_int'
  //   }
  // }

  // async fails (errorMessages) {
  //   return this.ctx.response.send(errorMessages)
  // }

}

module.exports = UpdatePost
