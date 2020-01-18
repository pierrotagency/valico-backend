'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagsSchema extends Schema {
  up () {
    this.create('tags', (table) => {
      table.increments()
      table.string('label', 100).notNullable().unique()
      table.string('value', 100).notNullable().unique()
    })
  }

  down () {
    this.drop('tags')
  }
}

module.exports = TagsSchema
