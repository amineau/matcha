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
            pic: {
                maxLength: 30,
                message: "Tag invalide"
            },
            idPic: {
                match: /^[0-9]+$/,
                message: 'Id invalide'
            }
        };
    }

    ParsePic(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserPic())
            .then(() => this.GetResult());
    }

    ParseIdPic(data) {
        return new Promise((resolve) => {
            this._parsed.id = data.id;
            resolve();
        })
            .then(() => this.ParserIdPic())
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

    ParserPic() {
        return new Promise((resolve) => {
            const pic = this._toParse.pic;
            if (pic) //&& pic.length <= this._parser.pic.maxLength)
                this._parsed.pic = pic;
            else
                this._errors.push({key: "pic", message: this._parser.pic.message});
            resolve(this._parsed);
        });
    }

    ParserIdPic() {
        return new Promise((resolve) => {
            const idPic = this._toParse.idPic;
            if (idPic != null && idPic.toString().match(this._parser.idPic.match))
                this._parsed.idPic = idPic;
            else
                this._errors.push(this._parser.idPic.message);
            resolve(this._parsed);
        });
    }
};