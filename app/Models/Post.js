'use strict'

const Model = use('Model')

class Post extends Model {

    static boot() {
        super.boot();
        this.addHook("beforeCreate", "PostHook.uuid");

        this.addHook('afterFind', 'PostHook.addFindRelations')
		this.addHook('afterFetch', 'PostHook.addFetchRelations')
        this.addHook('afterPaginate', 'PostHook.addPaginateRelations')
        
    }

    static get primaryKey() {
        return "uuid";
    }
    
    static get incrementing() {
        return false;
    }

    // static get computed () {
    //     return ['path']
    // }

    user() {
        return this.belongsTo('App/Models/User');
    }

    parent() {
        return this.belongsTo('App/Models/Post','parent_uuid','uuid');
    }

    // getPath(model) {
    //     return res;
    // }

}

module.exports = Post
