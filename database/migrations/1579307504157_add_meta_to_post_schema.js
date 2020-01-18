'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddMetaToPostSchema extends Schema {
  up () {
    this.table('posts', (table) => {
      // alter table
      table.string('meta_title',200)
      table.string('meta_description',400)
      table.json('meta_keywords')
      table.string('meta_image',200)
    })
  }

  down () {
    this.table('posts', (table) => {
      // reverse alternations
      table.dropColumn('meta_title')
      table.dropColumn('meta_description')
      table.dropColumn('meta_keywords')
      table.dropColumn('meta_image')
    })
  }
}

module.exports = AddMetaToPostSchema
