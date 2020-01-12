'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostsSchema extends Schema {
  up () {
    this.create('posts', (table) => {

      table.uuid('uuid').primary()
      table.uuid('parent_uuid').index()     
      
      table.string('slug', 100).notNullable().unique().index()
      table.string('url', 800)

      table.string('name', 200)
      
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('Users.id').onDelete('cascade');
      // table.integer('user_id').unsigned().references('id').inTable('users')
      
      table.boolean('is_draft').defaultTo(false)      
      table.uuid('draft_of').index()     

      table.boolean('is_published').defaultTo(false)      
      table.integer('sort').unsigned().defaultTo(1) 
      
      table.string('type', 100)
      table.string('template', 100)
      table.string('taxonomy', 100)      

      table.boolean('childs_allowed').defaultTo(true)           
      table.string('childs_type', 100)  
      table.string('childs_template', 100)  
      table.string('childs_taxonomy', 100)  
      
      table.string('external_url', 255)
      table.boolean('external_url_blank').defaultTo(true)    
      
      table.json('data') // holds taxonomy data
      table.json('content') // holds the modules and its properties
      table.json('params') // holds extra data (might be OpenGraph and custom parameters)

      table.timestamps()
      
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostsSchema


// this.create('tmp_posts', (table) => {
//   table.increments()
//   table.string('title')
//   table.string('description')
//   table.integer('user_id').unsigned();
//   table.foreign('user_id').references('Users.id').onDelete('cascade');
//   table.timestamps()
// })