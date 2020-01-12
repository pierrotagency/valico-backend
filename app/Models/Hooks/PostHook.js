'use strict'


const uuidv4 = require("uuid/v4");

const PostHook = exports = module.exports = {}

PostHook.method = async (modelInstance) => {
}

PostHook.uuid = async model => {
    model.uuid = uuidv4();
};