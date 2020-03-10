/*==============================================================
Author : Camélia Zarzitski
Date : 27/09/2019
Objet : UcIdentification
==============================================================*/
var appRoot = require('path').dirname(require.main.filename);
var User = require(appRoot + "/src/models/users.js");
var Credits = require(appRoot + "/src/models/Credits.js"); 
var crypto = require('crypto');
var co = require('co');

var UcIdentification = {
	
	
  //===================================================
  // Cette methode initialise le UcIdentification
  //===================================================
  doIt: function(app) {
  	var login = co.wrap(UcIdentification.login);
  	app.post('/login', login);
  },

  //===================================================
  // Cette methode tente de connecter l'utilisateur
  //===================================================
  login: function * (req, res) {
    var user = { email : "", pwd : "" };
    var errors = [];

    //recherche le user avec le contenu de la requête
	if(typeof req.body['email'] != "undefined" && req.body['email'] != "")
      user.email = req.body['email'];
    else
		res.status(400).send({ errors : ["email manquant"] });

    if(typeof req.body['password'] != "undefined" && req.body['password'] != "")
      user.pwd = crypto.createHash('sha256').update(req.body['password']).digest('hex');
    else
      res.status(400).send({ errors : ["mot de passe manquant"] });
    
    //teste si l'email et le mot de passe existe dans la base de donnée
    var checkUser = co.wrap(UcIdentification.checkUser);
    var userFinal = yield checkUser(user, errors);
	//console.log(userId);
    //si le utilisateur a bien été identifié, retourne l'id du user
    if(userFinal != -1){
      //ajoute l'identifiant d'utilisateur dans la session
      req.session.userId = userFinal.userId;
      res.status(200).send({ userFinal : userFinal });
    }
    //sinon retourner les messages d'erreurs
    else{
      res.status(401).send({ errors : ["identifiants incorrects"] });
	}
  },
	
//===================================================
  // Cette methode teste si l'email et le mot de passe existe dans la base de donnée
  //===================================================
  setDailyCredits: function * (user) {
  	try{
		var credits = yield Credits.findOne({ where : {userId: user.userId }, attributes: ['creditsId', 'coins', 'pm'] });
		if (!UcIdentification.isToday(user.lastConnectionDate)) {
			credits.coins += 15;
			credits.pm += 15;
			credits.save();
			user.lastConnectionDate = new Date();
			user.save();
		}
  	}
  	catch(e){
      console.log(e);
  	}
  },
  //===================================================
  // Cette methode teste si l'email et le mot de passe existe dans la base de donnée
  //===================================================
  checkUser: function * (user) {
  	try{
		var userTmp = yield User.findOne({ where : {email: user.email, pwd: user.pwd }, attributes: ['userId', 'pseudo', 'lastConnectionDate'] });
		if (userTmp != null) {
			yield UcIdentification.setDailyCredits(userTmp);
			return userTmp;
		}
		else{
			return -1;
		}
  	}
  	catch(e){
      console.log(e);
  		return -1;
  	}
  },
  
  isToday: function(someDate) {
	  const today = new Date();
	  return someDate.getDate() == today.getDate() &&
		someDate.getMonth() == today.getMonth() &&
		someDate.getFullYear() == today.getFullYear()
	}
}

module.exports = UcIdentification;
