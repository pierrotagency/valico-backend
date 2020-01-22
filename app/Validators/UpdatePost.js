'use strict'

class UpdatePost {
  
  get rules () {
    return {
      name: 'required|min:6',
      slug: 'required|unique:posts,slug'
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
