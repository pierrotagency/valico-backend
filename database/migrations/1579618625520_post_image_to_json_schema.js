'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostImageToJsonSchema extends Schema {
  up () {
    this.table('posts', (table) => {
      // alter table
      table.json('meta_image').alter()
    })
  }

  down () {
    this.table('posts', (table) => {
      // reverse alternations
      table.string('meta_image',200).alter()
    })
  }
}

module.exports = PostImageToJsonSchema
