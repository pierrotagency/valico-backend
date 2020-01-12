'use strict'
const Post = use('App/Models/Post');
const { validate } = use('Validator');

class PostController {

  async getPosts({req, res}) {
    
    let posts = await Post.query().with('user').fetch()

    return res.json(posts)
  }

  async create() {
  }

  async store({req, auth, res}) {

    const rules = {
      title: 'required',
      description: 'required'
    };

    const fields = req.all();

    const validation = await validate(fields, rules);

    if (!validation.fails()) {

        
      try {
        // if (await auth.check()) {
        let post = await auth.user.posts().create(fields)
        await post.load('user');
        return res.json(post)
        // }

      } catch (e) {
        console.log(e)
        return res.json({message: 'You are not authorized to perform this action'})
      }

    } else {
      res.status(401).send(validation.messages());
    }

  }

  async update({auth, params, res}) {

    let post = await Post.find(params.id)
    post.title = req.input('title')
    post.description = req.input('description');

    await post.save()
    await post.load('user');

    return res.json(post)
  }

  async delete({auth, params, res}) {

    await Post.find(params.id).delete()

    return res.json({message: 'Post has been deleted'})
  }

}

module.exports = PostController
