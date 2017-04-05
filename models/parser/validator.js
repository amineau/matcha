'use strict'

const _ = require('lodash')

module.exports = class Validator {

    /**
     * Constructor
     */
    constructor (toParse, parser) {
        this._toParse = toParse
        this._parser = parser
        this._parsed = {}
        this._errors = {}
    }

    /**
     * @description [description]
     * @public
     * @return {Promise}
     */

    Parse (data) {
        console.log(data)
        let i = 0
        const myParser = (path) => {
            return this.Parser(path.name, path.noReq)
        }
        return new Promise((resolve) => {
            setImmediate(function myPromise () {
                return myParser(data[i])
                    .then(() => {
                        if (++i < data.length) {
                            setImmediate(myPromise)
                        } else {
                            resolve()
                        }
                    })
            })
        })
            .then(() => this.GetResult())
    }

    Parser (obj, optionnal = false) {
        return new Promise((resolve) => {
            const value = this._toParse[obj]
            if (!optionnal || (value && optionnal)) {
                // console.log('obj :', obj, 'value :', value)
                if (value && value.match(this._parser[obj].match)) {
                    this._parsed[obj] = this._parser[obj].action ? this._parser[obj].action(value) : value
                } else {
                    this._errors[obj] = {
                        type: 'wrong format',
                        message: this._parser[obj] ? this._parser[obj].message : obj + ' not found'
                    } }
            }
            resolve(this._parsed)
        })
    }

    GetResult () {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(this._errors)) {
                resolve(this._parsed)
            } else {
                reject({error: this._errors})
            }
        })
    }
}
