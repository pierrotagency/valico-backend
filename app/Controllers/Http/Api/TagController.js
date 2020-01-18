'use strict'
const Tag = use('App/Models/Tag');
const { validate } = use('Validator');

class TagController {

  async list({request, response}) {
    
    const tags = await Tag.all()
      
    return response.json(tags)
  }

  async store({request, auth, response}) {
    const rules = {
      'tags': 'required',
      'tags.*.label': 'required',
      'tags.*.value': 'required'      
    };

    const fields = request.all();

    console.log(fields)

    const validation = await validate(fields, rules);
    if (!validation.fails()) {

      try {

        // let tag = await Tag.create(fields)        
        const tags = await Tag.createMany(fields.tags);
        return response.json(tags)
      
      } catch (e) {
          console.log(e)
          return response.json({code: 500, message: e.message})
      }

    } else {
      response.status(422).send(validation.messages());
    }

  }

}

module.exports = TagController
