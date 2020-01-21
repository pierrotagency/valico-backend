'use strict'
const Post = use('App/Models/Post');
const Tag = use('App/Models/Tag');
const { validate } = use('Validator');

class PostController {

  async list({request, response}) {
    
    const fields = request.all();

    const page = fields.page? fields.page : 1;
    const epp = fields.epp? fields.epp : 5;
    let sort = fields.sort? fields.sort : 'created_at-';

    let sortDirection = 'asc'
    if(sort.slice(-1)==='-'){
      sortDirection = 'desc'
      sort = sort.substring(0, sort.length - 1);
    }
    
    const posts = await (fields.father 
      ? Post.query().with('user').where('parent_uuid', '=', fields.father).orderBy(sort,sortDirection).paginate(page, epp)
      : Post.query().with('user').whereNull('parent_uuid').orderBy(sort,sortDirection).paginate(page, epp)
    )

    return response.json(posts)
  }

  async create() {
  }

  async store({request, auth, response}) {
    const rules = {
      post: 'required'
    };

    const fields = request.all();

    const validation = await validate(fields, rules);
    if (!validation.fails()) {
  
      try {

        let post = await auth.user.posts().create(fields)

        let newTags = fields.meta_keywords.filter(tag => tag.isNew)
            newTags.forEach(function(i){ delete i.isNew });
        const tags = await Tag.createMany(newTags);

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

  async update({auth, request, response}) {
    const rules = {
      post: 'required'      
    };

    const fields = request.all();

    const validation = await validate(fields, rules);
    if (!validation.fails()) {
  
      try {

        let paramPost = fields.post; 
        let post = await Post.find(paramPost.uuid)
        
        let newTags = paramPost.meta_keywords.filter(tag => tag.isNew)
            newTags.forEach(function(i){ delete i.isNew });
        
        paramPost.meta_keywords.forEach(function(i){ delete i.isNew });

        post.merge(paramPost)

        await post.save()
        await post.load('user');

        const addedTags = await Tag.createMany(newTags);

        return response.json(post)

      } catch (e) {
        console.log(e)
        return response.json({code: 500, message: e.message})
      }

    } else {
      return response.status(422).send(validation.messages());
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

  async peep({auth, params, response}) {

    try {
        
      let post = await Post.find(params.id)
      if(post){       
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


  async slugExists({auth, params, request, response}) {

    const rules = {
      slug: 'required'      
    };

    const fields = request.all();

    const validation = await validate(fields, rules);
    if (!validation.fails()) {

      try {
          
        let post = await Post.findBy('slug', fields.slug)
        if(post){       
          return response.json({
            found: true,
            id: post.uuid,
            name: post.name
          })
        }
        else{
          return response.json({
            found: false            
          })
        }
        
      } catch (e) {
        console.log(e)
        return response.json({code: 500, message: e.message})
      }

    
    } else {
      response.status(422).send(validation.messages());
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
