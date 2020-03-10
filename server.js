var http = require('http');
var appRoot = require('path').dirname(require.main.filename);
var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
require(appRoot+ '/initModel');
var routes = require(appRoot+'/routes');
var session = require('express-session');
var app = express();

logger.info('Server start');
logger.info(appRoot.toString());

routes.start(app);
logger.info('Set routes OK!');

app.listen(process.env.PORT||4242);