'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PagesSchema extends Schema {
  up () {
    this.create('pages', (table) => {
      table.uuid('uuid').primary()
      table.uuid('parent_uuid').index()     
      table.string('slug', 100).notNullable().unique().index()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('layout', 100)
      table.string('url', 255)
      table.boolean('is_blank').defaultTo(false)
      table.boolean('is_published').defaultTo(false)
      table.integer('sort').unsigned().defaultTo(1)      
      table.timestamps()
      
    })
  }

  down () {
    this.drop('pages')
  }
}

module.exports = PagesSchema
