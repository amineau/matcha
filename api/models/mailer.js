'use strict'

const nodemailer = require('nodemailer')
const dateFormat = require('dateformat')

module.exports = class Mailer {

  constructor (nconf) {
    this._signature = '<h2>L\'équipe Matcha</h2>'
    this._nconf = nconf
    this._sendMail = (mailOptions) => {
      return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport(this._nconf.get('smtp'))
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return reject(error)
          }
          console.log('message send :' + info.response)
          resolve()
        })
      })
    }
  }

  ForgotPassword (value) {
    const mailOptions = {
      from: this._nconf.get('email:noReply'),
      to: value.email,
      subject: 'Changement de mot de passe',
      html: `<h5>Bonjour ${value.firstName}</h5>
    	  	<p>Vous pouvez dès à présent modifier votre mot de passe en suivant ce
            <a href="${this._nconf.get('domain')}changepassword/${value.linkPassword}">
              lien
            </a>
          </p>
    	  	${this._signature}.`
    }
    return this._sendMail(mailOptions)
  }
}
