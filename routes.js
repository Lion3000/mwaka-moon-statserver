
var appRoot = require('path').dirname(require.main.filename);
var cors = require('cors');
var bodyParser = require('body-parser');
var Results = require(appRoot + "/models/Results.js"); 

module.exports = {
  start: function(app) {
	
	app.use(cors({origin: '*'}));
	app.use(bodyParser.json());
    app.get('/home', function(req, res){
      res.send('PONG !!!');
    });
	app.get('/set/', function(req, res){
		//console.log(req);
		if(typeof req.query['pseudo'] != "undefined" && typeof req.query['scoreChrono'] != "undefined"){
			var result = {
					"pseudo": req.query['pseudo'],
					"scoreChrono": req.query['scoreChrono']
			}
			Results.create(result).then(() => {
				console.log('result added');
				res.send('result added');
			});
		}
		else{
			res.send('error');
		}
    });
	app.get('/', function(req, res){
		Results.findAll({limit: 10, order: [ ['scoreChrono']]}).then(results => {
			console.log(results);
			var resStr = [];
			for(var i = 0; i < results.length; i++){
				resStr.push(results[i].scoreChrono+" - "+ results[i].pseudo);
			}
			if(results.length > 0){
				var scoreLimit = results[results.length-1].scoreChrono;
				Results.findAll({order: [ ['scoreChrono']]}).then(resultsAll => {
					if(resultsAll.length > 10){
						for(var i = 0; i < resultsAll.length; i++){
						if(resultsAll[i].scoreChrono > scoreLimit)
							resultsAll[i].destroy();
						}
					}
				});
			}
			res.send(resStr);
		});
	});
	
	app.get('/removeAllScores', function(req, res){
		var deleted = [];
		Results.findAll().then(results => {
			for(var i = 0; i < results.length; i++){
				results[i].destroy().then(function(instance){
				  // instance = null if row has not been deleted
				  deleted[i] = instance;
				});
			}
		});
		res.send("deleted instances : " + deleted);
	});
	
	app.get('/removeLastScore', function(req, res){
		var deleted = null;
		var truc = null;
		Results.findAll({limit: 1, order: [['resultId', 'DESC']]}).then(results => {
				truc = results;
				results[0].destroy().then(function(instance){
				  // instance = null if row has not been deleted
				  deleted = instance;
				});
		});
		res.send("deleted instance :  " + deleted + " truc : " + truc);
	});
	
	
  }
}
