'use strict'

class StorePost {
  
  get rules () {

    const postUuid = this.ctx.params.uuid

    console.log(postUuid)

    return {
      name: `required|min:6`,
      slug: `required|unique:posts,slug,uuid,${postUuid}`
    }
  }

  get messages () {
    return {
      'name.required': 'You must provide a name',
      'name.min': 'You must provide a longer name.',
      'slug.required': 'This slug is required.',
      'slug.unique': 'The slug {{slug}} is already being used by another post'
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

module.exports = StorePost
