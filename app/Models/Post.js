'use strict'

const Model = use('Model')

class Post extends Model {

    static boot() {
        super.boot();
        this.addHook("beforeCreate", "PostHook.uuid");
    }

    static get primaryKey() {
        return "uuid";
    }
    
    static get incrementing() {
        return false;
    }

    user() {
        return this.belongsTo('App/Models/User');
    }
}

module.exports = Post
