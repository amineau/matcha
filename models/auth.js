"use strict"

module.exports = class Auth {

    /**
     * Constructor
     */
    constructor(session) {
        this._session = session;
        this._status = 401;
        this._isAuthErr = "Vous êtes déjà connecté";
        this._isNotAuthErr = "Vous n'êtes pas connecté";
    }

    CheckAuth () {
        return new Promise((resolve, reject) => {
            if (this._session.userId) {
                reject({
                    status: this._status,
                    error: this._isAuthErr
                });
            }
            resolve();
        });
    }

    CheckNoAuth () {
        return new Promise((resolve, reject) => {
            if (!this._session.userId) {
                reject({
                    status: this._status,
                    error: this._isNotAuthErr
                });
            }
            resolve();
        });
    }
};