'use strict'

// const Drive = use('Drive')
const crypto = use('crypto')


/**
 * Parse JSON if is not already a JSON
 * @param  {string}   str - a Json or a String that should be json
 * @return {string}   The JSON always
 */
const safeParseJSON = (str) => {
    let res = {};
    try {
        res = JSON.parse(str);
    } catch (e) {
        return {};
    }
    return res;    
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
    safeParseJSON
}