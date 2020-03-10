
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
	app.post('/', function(req, res){
		if(typeof req.body['pseudo'] != "undefined" && req.body['scoreChrono'] != ""){
			var result = {
					"pseudo": req.body['pseudo'],
					"scoreChrono": req.body['scoreChrono']
			}
			Results.create(result).then(() => {
				console.log('result added');
			});
		}
    });
	app.get('/', function(req, res){
		var results = Results.findAll(limit: 10, order: [ ['scoreChrono']]).then(() => {
			res.send(results);
		});
	});
  }
}
