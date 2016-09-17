/*jshint node:true */

'use strict';

const ParserDb	 	= require("../models/parser");
const db			= require("../db");
const crypto 		= require("crypto");

const parser = new ParserDb();

function reqDatabase(query, params, parser, res) {
    const showSucces = (data) => {
        console.log(data);
        res.json(data);
    };
    const showError = (err) => {
        res.status(403).json(err);
    };

    return db.doDatabaseOperation(query, params, parser)
            .then(showSucces)
            .catch(showError);
}

exports.loginExist = (req, res) => {
    const login = req.body.login;
    const query =
        `MATCH (u: User)
        WHERE u.login = {login}
        RETURN u;`;
    const params = {"login": login};

    reqDatabase(query, params, parser.getTrue, res);
};

exports.emailExist = (req, res) => {
    const email = req.body.email;
    const query =
        `MATCH (u: User)
        WHERE u.email = {email}
        RETURN u;`;
    const params = {"email": email};

    reqDatabase(query, params, parser.getTrue, res);
};

exports.signUp = (req, res) => {
    const sha256 	= crypto.createHash("sha256");
    const user 		= req.body;
    if (!user.login || !user.password || !user.email || !user.firstName || !user.lastName) {
        res.status(206).json({
            success: false,
            message: "Informations manquantes"
        });
        return;
    }
    const query 	=
        `CREATE(user: User {
         	name: {login},
            email: {email},
            firstName: {firstName},
            lastName: {lastName},
            password: {password}
        })
        RETURN *;`;
    const params 	= {
      'login': user.login,
      'email': user.email,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'password': sha256.update(user.password).digest("base64")
    };

    reqDatabase(query, params, parser.getTrue, res);
};

exports.signIn = (req, res) => {
    const sha256 	= crypto.createHash("sha256");
    const user 		= req.body;
    const query 	=
        `MATCH (u:User)
        WHERE u.name = {login}
        AND u.password = {password}
        RETURN u`;
    const params 	= {
        'login': user.login,
        'password': sha256.update(user.password).digest("base64")
    };

    const showSucces = (data) => {
        if (req.session.userId){
            res.json({success: false, message: "Vous êtes déjà connecté"})
        }else if ((req.session.userId = data.id[0])) {
            res.json({success: true});
        } else {
            res.json({success: false, message: "Login et/ou mot de passe incorrect"})
        }
    };

    const showError = (err) => {
        console.log(err);
        res.status(403).json({success: false, message: "Un problème de connection à la base de donnée est survenu. Veuillez réessayer ultérieurement"});
    };

    db.doDatabaseOperation(query, params, parser.getIds)
        .then(showSucces)
        .catch(showError);
};

exports.logout = (req, res) => {
    if (req.session.userId) {
        req.session.destroy((err) => {
            if (err) {
                res.json({
                    success: false,
                    err: err
                });
            } else
                res.json({success: true});
        })
    } else {
        res.status(401).json({
            success: false,
            err: "Déconnexion impossible, vous n'êtes pas connecté."
        });
    }
}

exports.getIdByLogin = (req, res) => {
    const login		= req.body.login;
    const query		=
        `MATCH (u:User)
        WHERE u.name = {login}
        RETURN u;`;
    const params	= {'login': login};

    reqDatabase(query, params, parser.getIds, res);
};

exports.getIdByEmail = (req, res) => {
    const email		= req.body.email;
    const query		=
        `MATCH (u:User)
        WHERE u.email = {email}
        RETURN u;`;
    const params	= {'email': email};

    reqDatabase(query, params, parser.getIds, res);
};

exports.getById = (req, res) => {
    const id		= Number(req.params.id);
    const query		=
        `MATCH (u:User)		
        WHERE id(u) = {id}
        RETURN u;`;
    const params	= {'id': id};

    reqDatabase(query, params, parser.getData, res);
};

exports.setLogin = (req, res) => {
    const id 	= req.session.userId;
    const login	= req.body.login;
    const query	=
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.name = {login}
        RETURN u;`;
    const params	= {
        'id': id,
        'login': login
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setEmail = (req, res) => {
  const id 	  = req.session.userId;
  const email = req.body.email;
  const query =
      `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.email = {email}
        RETURN u;`;
  const params	= {
    'id': req.session.userId,
    'email': email
  };

  reqDatabase(query, params, parser.getDebug, res);
};

exports.setPassword = (req, res) => {
    const sha256 	= crypto.createHash("sha256");
    const id 	= req.session.userId;
    const email = req.body.password;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.password = {password}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'password': sha256.update(password).digest("base64")
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setFirstName = (req, res) => {
    const id 	    = req.session.userId;
    const firstName = req.body.firstName;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.firstName = {firstName}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'firstName': firstName
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setLastName = (req, res) => {
    const id 	    = req.session.userId;
    const lastName = req.body.lastName;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.firstName = {firstName}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'lastName': lastName
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setSex = (req, res) => {
    const id 	= req.session.userId;
    const sex   = req.body.sex;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.sex = {sex}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'sex': sex
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setPrefer = (req, res) => {
    const id 	 = req.session.userId;
    const prefer = req.body.prefer;
    const query  =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.prefer = {prefer}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'prefer': prefer
    };

    reqDatabase(query, params, parser.getDebug, res);
};

exports.setBio = (req, res) => {
    const id 	= req.session.userId;
    const bio   = req.body.bio;
    const query =
        `MATCH (u:User)
        WHERE id(u) = {id}
        SET u.bio = {bio}
        RETURN u;`;
    const params	= {
        'id': req.session.userId,
        'bio': bio
    };

    reqDatabase(query, params, parser.getDebug, res);
};