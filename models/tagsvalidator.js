"use strict";

module.exports = class TagsValidator {

    /**
     * Constructor
     */
    constructor(toParse) {
        this._toParse = toParse;
        this._parsed = {};
        this._errors = [];
        this._parser = {
            id: {
                match: /^[0-9]+$/,
                message: 'Id invalide'
            },
            tag: {
                maxLength: 30,
                message: "Tag invalide"
            }
        };
    }

    ParseTag() {
        return Promise.resolve()
            .then(() => this.ParserTag())
            .then(() => this.ParserId())
            .then(() => this.GetResult());
    }

    ParseId() {
        return Promise.resolve()
            .then(() => this.ParserId())
            .then(() => this.GetResult());
    }

    GetResult() {
        return new Promise((resolve, reject) => {
            if (this._errors.length == 0)
                resolve(this._parsed);
            else
                reject({
                    status: 403,
                    error: this._errors[0]
                });
        })
    }

    ParserTag() {
        return new Promise((resolve) => {
            const tag = this._toParse.tag;
            if (tag && tag.length <= this._parser.tag.maxLength)
                this._parsed.tag = tag;
            else
                this._errors.push({key: "tag", message: this._parser.tag.message});
            resolve(this._parsed);
        });
    }

    ParserId() {
        return new Promise((resolve) => {
            const id = this._toParse.id;
            if (id != null && id.toString().match(this._parser.id.match))
                this._parsed.id = id;
            else
                this._errors.push(this._parser.id.message);
            resolve(this._parsed);
        })
    }
};