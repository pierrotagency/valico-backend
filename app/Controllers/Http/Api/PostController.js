'use strict'
const Post = use('App/Models/Post');
const { validate } = use('Validator');

class PostController {

  async list({request, response}) {
    
    const fields = request.all();
    console.log(fields);

    let posts = [];
    if(fields.father){
      posts = await Post.query().with('user').where('parent_uuid', '=', fields.father).fetch()
    }
    else{
      posts = await Post.query().with('user').whereNull('parent_uuid').fetch()
    }
    
    

    return response.json(posts)
  }

  async create() {
  }

  async store({request, auth, response}) {
    const rules = {
      name: 'required',
      slug: 'required'
    };

    const fields = request.all();

    const validation = await validate(fields, rules);
    if (!validation.fails()) {
  
      try {

        let post = await auth.user.posts().create(fields)
        await post.load('user');
        return response.json(post)
      
      } catch (e) {
        console.log(e)
        return response.json({code: 500, message: e.message})
      }

    } else {
      response.status(422).send(validation.messages());
    }

  }

  async update({auth, params, response}) {
    const rules = {
      name: 'required',
      slug: 'required'
    };

    const validation = await validate(fields, rules);
    if (!validation.fails()) {
  
      try {

        let post = await Post.find(params.id)
        
        post.name = request.input('name')
        post.slug = request.input('slug');

        await post.save()
        await post.load('user');

        return response.json(post)

      } catch (e) {
        console.log(e)
        return response.json({code: 500, message: e.message})
      }

    } else {
      response.status(422).send(validation.messages());
    }
    
  }


  async get({auth, params, response}) {

    try {
        
      let post = await Post.find(params.id)
      if(post){
        await post.load('user');
        return response.json(post)
      }
      else{
        response.status(404).send({code: 404, message: 'Post not found'});
      }
      
    } catch (e) {
      console.log(e)
      return response.json({code: 500, message: e.message})
    }

  }


  async delete({auth, params, response}) {

    try {
        
      let post = await Post.find(params.id)
      if(post){
        
        await Post.find(params.id).delete()

        return response.json({message: 'Post deleted'})
        
      }
      else{
        response.status(404).send({code: 404, message: 'Post not found'});
      }
      
    } catch (e) {
      console.log(e)
      return response.json({code: 500, message: e.message})
    }

  }

}

module.exports = PostController
