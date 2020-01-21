'use strict'

const Model = use('Model')

class Post extends Model {

    get jsonFields () {
        return [ 'content', 'data', 'params', 'meta_keywords','meta_image' ]
    }

    static boot() {
        super.boot();

        this.addTrait('@provider:Jsonable')
        
        this.addHook("beforeCreate", "PostHook.uuid");
        this.addHook('beforeSave', 'PostHook.addUpateRelations')

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


    getChildsAllowed (value) {
        return value===1? true : false;
    }

    setChildsAllowed (value) {
        return value? 1 : 0;
    }

}

module.exports = Post
