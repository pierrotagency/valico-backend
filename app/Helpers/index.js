'use strict'

// const Drive = use('Drive')
const crypto = use('crypto')

const uuidv4 = require("uuid/v4");


/**
 * Parse JSON if is not already a JSON
 * @param  {string}   str - a Json or a String that should be json
 * @return {string}   The JSON always
 */
const safeParseJSON = (str) => {    
    if(typeof str === 'string' && (str.charAt(0) === '{'  || str.charAt(0) === '['))
        return JSON.parse(str);
    else
        return {};    
}


/*

From
Photo-9.jpg,
{   
    size: "145963"
    type: "image"
}
To 52054432-5a54-4504-b90e-6e94c3e59852--name-photo_9--size-145963--type-image.jpg
*/
const gatMetaFilename = ( originalFilename, params={}, uuid=null ) => {    
    
    let newName = originalFilename.replace(/\.[^/.]+$/, "") // remove extension
        newName = newName.replace('-','_').replace(/[^a-z0-9]/gi, '_').toLowerCase() // sanitize filename and remove - thast will be used fopr file params
    
    const prefixId = uuid ? uuid : uuidv4()
    
    const ext = originalFilename.split('.').pop().toLowerCase()

    let stringParams = ''
    Object.keys(params).map(key => {
        stringParams += '--' + key + '-' + params[key].toString().replace('-','_').replace(/[^a-z0-9]/gi, '_').toLowerCase()
    })
    
    const finalName = `${prefixId}--name-${newName}${stringParams}.${ext}`

    return finalName.toLowerCase();

}

/*
From 52054432-5a54-4504-b90e-6e94c3e59852--name-photo_9--size-145963--type-image.jpg
To
{
    original: "52054432-5a54-4504-b90e-6e94c3e59852--name-photo_9--size-145963--type-image.jpg"
    ext: "jpg"
    uuid: "52054432-5a54-4504-b90e-6e94c3e59852"
    name: "photo_9"
    size: "145963"
    type: "image"
    filename: "photo_9.jpg"
}
*/
const parseMetaFilename = ( filename ) => {    
    let obj = {}
    
    const name = filename.replace(/\.[^/.]+$/, "") // remove extension
    const ext = filename.split('.').pop()

    obj.original = filename
    obj.ext = ext
    
    name.split('--').forEach((part,index) => {
        if(index===0)
            obj.uuid = part
        else{
            const param = part.split('-')
            if(param.length===2) obj[param[0]] = param[1]
        }        
    })

    // add computed filename for common purposes
    obj.filename = (obj.name && obj.ext) ? `${obj.name}.${obj.ext}` : ''

    return obj
}


/**
 * Return ISO formasted date 
 * @return {string}   2020-01-24
 */
const getTodayISO = () => {    
    
    let date_ob = new Date()
    let date = ("0" + date_ob.getDate()).slice(-2)
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    let year = date_ob.getFullYear()

    return `${year}-${month}-${date}`
}



/**
 * Remove all properties starting with _ from the object (in my schema, are meta properties, not attached to the object)
 * @param  {object}   object - The object to be modified
 * @return {object}   ... ref? TODO 
 */
const removeMetaFromObject = (object = {}) => {    
    
    Object.keys(object).map(key => {
        if(key.charAt(0)==='_') delete object[key];        
    })
    
    return object;

}









/**
 * Upload file to remote storage
 * @param  {string}   stream - The file stream.
 * @param  {string}   path - The storage path including file name and extension
 * @return {string}   The final location
 */
const upload = async (stream, path) => {
//   await Drive.disk('s3').put(path, stream)

//   if (await Drive.disk('s3').exists(path)) {
//     return await Drive.disk('s3').getUrl(path)
//   }
}


/**
 * Generate "random" alpha-numeric string.
 *
 * @param  {int}      length - Length of the string
 * @return {string}   The result
 */
const str_random = async (length = 40) => {
    let string = ''
    let len = string.length

    if (len < length) {
        let size = length - len
        let bytes = await crypto.randomBytes(size)
        let buffer = new Buffer(bytes)

        string += buffer
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substr(0, size)
    }

    return string
}

module.exports = {
    upload,
    str_random,
    safeParseJSON,
    gatMetaFilename,
    parseMetaFilename,
    getTodayISO,
    removeMetaFromObject
}