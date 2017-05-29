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
    console.log(this._nconf.get('email:noReply'))
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

  // ModifPassword (value) {
  //   const mailOptions = {
  //     from: nconf.get('email:NoReply'),
  //     to: value.email,
  //     subject: 'Changement de votre mot de passe',
  //     html: `<h2>Bonjour  ,</h2> <br>
  //   	  	<p> La modification de votre mot de passe s'est faite avec succès. </p>
  //   	  	<p> Si vous n'êtes pas à l'origine de ce changement, contactez nous au plus vite. </p><br><br>
  //   	  	${this._signature}`
  //   }
  //   return this._sendMail(mailOptions)
  // }

  // ModifEmail (value) {
  //   const mailOptions = {
  //     from: nconf.get('email:NoReply'),
  //     to: value.email,
  //     subject: 'Changement de votre adresse mail',
  //     html: ` <h3>Bonjour , </h3> <br> <h2> La modification de votre adresse mail s\'est faite avec succès .</h2> <br><br><br>  ${this._signature}`
  //   }
  //   return this._sendMail(mailOptions)
  // }
  //
  // NewExpedition (value) {
  //   const mailOptions = {
  //     from: nconf.get('email:NoReply'),
  //     to: value.email,
  //     subject: 'Nouvelle expédition créée',
  //     html: `Bonjour ${value.firstName}<br/>
  //     <p>Un utilisateur que vous suivez vient d'inscrire une nouvelle expédition.<br/>
  //     Vous pouvez la consulter en vous rendant sur cette page : </p>
  //     <form method="GET" action="${nconf.get('domain')}/expe/${value.expeditionId}">
  //     <button type="submit">Voir l'expédition</button></form>
  //     ${this._signature}`
  //   }
  //   return this._sendMail(mailOptions)
  // }
  //
  // CarrierFound (value) {
  //   const mailOptions = {
  //     from: nconf.get('email:NoReply'),
  //     to: value.owner.email,
  //     subject: 'Un livreur s\'est proposé',
  //     html: `<h3>Bonjour ${value.owner.firstName},</h3>
  //     <p>Un nouveau livreur s'est proposé pour votre expédition <strong>${value.object}</strong>
  //      de ${value.sender.city} (${value.sender.cp.substr(0, 2)})
  //      à ${value.recipient.city} (${value.recipient.cp.substr(0, 2)})</p>
  //     <p>Vous pouvez dès à présent valider le livreur pour programmer l'expédition</p>
  //     <form method="PUT" action="${nconf.get('domain')}/carrier/validate/${value.carrierId}/expe/${value.id}">
  //     <button type="submit">Valider le transporteur[link à ajouter]</button></form>
  //     ${this._signature}`
  //   }
  //   return this._sendMail(mailOptions)
  // }
  //
  // ExpeditionValidated (value) {
  //   const mailOptions = {
  //     from: nconf.get('email:NoReply'),
  //     to: value.carrier.email,
  //     subject: 'Votre proposition de transport a été validée',
  //     html: `<h3>Bonjour ${value.carrier.firstName},</h3>
  //         <p>L'expédition de ${value.sender.city} (${value.sender.cp.substr(0, 2)})
  //         à  ${value.recipient.city} (${value.recipient.cp.substr(0, 2)})
  //         pour laquelle vous vous êtes proposé a été <strong>validée</strong>.</p>
  //        <p>Vous pouvez dès à présent contacter l'expéditeur pour programmer l'expédition avant le <strong> ${dateFormat(value.dateMax, 'dd/mm/yyyy')} </strong><br><br>
  //        <strong><u>Expéditeur :</u></strong><br/>
  //  	  ${infoUser(value.sender)}<br>
  //  	  <strong><u>Destinataire :</u></strong><br/>
  //  	  ${infoUser(value.recipient)}</p>
  //        ${this._signature}`
  //   }
  //   return this._sendMail(mailOptions)
  // }
  //
  // Supported (value) {
	//   console.log(value.recipient.email)
  //   const mailToRecipient = (value) => {
  //     const mailOptions = {
  //       from: nconf.get('email:NoReply'),
  //       to: value.recipient.email,
  //       subject: 'Colis pris en charge',
  //       html: `Bonjour ${value.recipient.firstName}, <p>Un livreur vient de prendre en charge un colis qui va vous être remis.<br/>
  //       Le code de validation à donner au livreur, <strong> uniquement lors de la remise du colis, </strong> est : <strong>${value.code}</strong>.<p/>
  //       <p> Si une autre personne que vous, pour cause d'empêchement, réceptionne votre colis, veuillez communiquer ce code à cette personne-ci.<br>
  //       Si le réceptionneur du colis n'a pas de code, le livreur n'aura <strong> aucune obligation </strong> de déposé le colis, puisque sans code, il ne sera pas payé.</p>
  //       <p>Bonne réception,</p>
  //       ${this._signature}`
  //     }
  //     return this._sendMail(mailOptions)
  //   }
  //
  //   const mailToOwner = (value) => {
  //     const mailOptions = {
  //       from: nconf.get('email:NoReply'),
  //       to: value.owner.email,
  //       subject: 'Colis pris en charge',
  //       html: `Bonjour ${value.owner.firstName}, <p>Un livreur vient de prendre en charge le colis en provenance de ${value.sender.city} et à destination de ${value.recipient.city}</p>
  //       <p>A bientôt,</p>
  //       ${this._signature}`
  //     }
  //     return this._sendMail(mailOptions)
  //   }
  //
  //   return new Promise((resolve) => {
  //     Promise.all([
  //       mailToRecipient(value),
  //       mailToOwner(value)
  //     ])
  //     .then(resolve())
  //   })
  // }
  //
  // Delivred (value) {
  //   /*let email = []
  //   for (let k in value) {
  //     email.push(value[k].email)
  //   }*/
  //   const mailOptions = {
  //     from: nconf.get('email:NoReply'),
  //     to: value.owner.email,
  //     subject: 'Colis livré',
  //     html: `Bonjour ${value.owner.firstName}, <p>Le colis a bien été livré.<p/>
  //     <h3> Merci d'avoir utilisez PbyP ! A très vite ! </h3>
  //     ${this._signature}`
  //   }
  //   this._sendMail(mailOptions)
  // }
  //
  // Report (value) {
	//    const mailOptions = {
	// 	from: nconf.get('email:NoReply'),
	//     to: value.email,
	//     subject: 'Signalement reçu',
	//     html: `Bonjour ${value.firstName},
	//     		<p>Votre signalement a bien été reçu. <p/>
	//     		<p>  Message envoyé : " ${value[0]['report']} "  </p>
	//     		${this._signature}`
	//     }
	//     this._sendMail(mailOptions)
	//   }
  //
  // ReportContact (value) {
	//   const mailOptions = {
	// 	from: value.email,
	// 	to: 'laure.catarino@fatton.com',
	// 	subject: 'Signalement' ,
	// 	html:  `<p>Signalement de la part de : <br>
	// 				${value.firstName} ${value.lastName} (${value.email}) <p/>
 // 				<p> " ${value[0]['report']} " </p>`
	// 	}
	// 	this._sendMail(mailOptions)
  // }

}
