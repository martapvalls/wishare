//module.exports = function (url, { method = 'GET', headers, body, formData} = {}) {
export default function (url, { method = 'GET', headers, body, formData} = {}) {
    return new Promise ((resolve, reject) => {
        try{

            let xhr = new XMLHttpRequest

            xhr.open(method, url)

            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 0) {
                        reject(new Error(`fail to call ${url}`))
                    } else {
                        const res = {
                            status: this.status,
                            body: this.responseText
                        }
                        resolve(res)
                    }
                }
            }
            if (headers)
                for (let key in headers)
                    xhr.setRequestHeader(key, headers[key])
            body ? xhr.send(body) : xhr.send()

            formData && xhr.send(formData)            
        }
        catch (error) {
            reject(error)
        }
    })
}