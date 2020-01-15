'use strict'

const Model = use('Model')

class Post extends Model {

    get jsonFields () {
        return [ 'content', 'data', 'params' ]
    }

    static boot() {
        super.boot();

        this.addTrait('@provider:Jsonable')
        
        this.addHook("beforeCreate", "PostHook.uuid");
        this.addHook('beforeSave', 'PostHook.addUpateRelations')

        this.addHook('afterFind', 'PostHook.addFindRelations')
		this.addHook('afterFetch', 'PostHook.addFetchRelations')
        this.addHook('afterPaginate', 'PostHook.addPaginateRelations')

        
        // this.addHook('beforeSave', async item => {
        //     delete item.$attributes.user
        //     delete item.$attributes.path
        //     return item
        // })
        
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
