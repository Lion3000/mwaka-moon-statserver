
var appRoot = require('path').dirname(require.main.filename);
var cors = require('cors');
var bodyParser = require('body-parser');
var Results = require(appRoot + "/models/Results.js"); 

var co = require('co');

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
			res.send(resStr);
		});
	});
  }
}
