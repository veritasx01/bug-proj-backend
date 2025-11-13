import fs from 'fs'
import http from 'http'
import https from 'https'

export const utilService = {
    readJsonFile,
    writeJsonFile,
    download,
    httpGet,
    makeId
}


function readJsonFile(path) {
    const json = fs.readFileSync(path, 'utf8')
    const data = JSON.parse(json)
    return data
}

function writeJsonFile(path, data) {
    return new Promise((resolve, reject) => {
        const json = JSON.stringify(data, null, 2)
        fs.writeFile(path, json, err => {
            if (err) reject(err)
            resolve(json)
        })
    })
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, (content) => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}

function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET'
    }

    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', (err) => {
            reject(err)
        })
        req.end()
    })

}

function makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}