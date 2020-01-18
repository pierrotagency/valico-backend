'use strict'

const Model = use('Model')

class Tag extends Model {


    static boot() {
        super.boot();
    }

    // static get object () {
    //     return ['path']
    // }

    // getObject(model) {
    //     return res;
    // }

    static get createdAtColumn () {
        return null
    }

    static get updatedAtColumn () {
        return null
    }

}

module.exports = Tag
