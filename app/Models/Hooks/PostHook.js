'use strict'


const uuidv4 = require("uuid/v4");

const PostHook = exports = module.exports = {}

PostHook.method = async (modelInstance) => {
}

PostHook.uuid = async model => {
    model.uuid = uuidv4();
};

PostHook.addFindRelations = async model => {
    // console.log('addFindRelations')

    model.path = await getPath(model);
    
};

PostHook.addFetchRelations = async models => {
    // console.log('addFetchRelations')

    for (let model of models) {
        model.path = await getPath(model);
    }

};


PostHook.addPaginateRelations = async models => {
    // console.log('addPaginateRelations')

    for (let model of models) {
        model.path = await getPath(model);
    }

};

async function getPath(model){

    let arr = []

    let parent = await model.parent().fetch()        
    while(parent){

        const obj = {
            uuid: parent.uuid,
            name: parent.name,
            slug: parent.slug,
            url: parent.url,
            type: parent.type
        }

        arr.push(obj)
        parent = await parent.parent().fetch()        
    }

    return arr
    
}