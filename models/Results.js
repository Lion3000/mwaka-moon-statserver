var appRoot = require('path').dirname(require.main.filename);
const Sequelize = require('sequelize');
var sequelize = require(appRoot + "/sequelize.js");
var DataTypes = require('sequelize/lib/data-types');
var db = sequelize.connection();

var Results = db.define('results', {
    resultId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pseudo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    scoreChrono: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, {
    tableName: 'results'
  });
module.exports = Results;
