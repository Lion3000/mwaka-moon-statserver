

var appRoot = require('path').dirname(require.main.filename);
const Sequelize = require('sequelize');
var sequelize = require(appRoot + "/sequelize.js");
var db = sequelize.connection();
var logger = require('log4js').getLogger('Server');
var co = require('co');
logger.info('Start init model'); 
	
var Results = require(appRoot + "/models/Results.js");


// Synchronise database with model
/*db.sync({force: true}).then(() => {
	console.log('Results tables OK');
}) /*

//Results.sync({force: true});
		
// Force sync all models
/*
co(function *(){ 
	yield Results.sync({force: false});
	}).catch (err => {
			console.error(err.message); // "boom"
		});		
	*/


logger.info('initModel finished !'); 		