
const Sequelize = require('sequelize');
module.exports = {
	connection: function(app) {
		if(process.env.DATABASE_URL_POSTGRES){
			const sequelize = new Sequelize(process.env.DATABASE_URL_POSTGRES);
		}
		else{
			const sequelize = new Sequelize("mmDB", "root", "", {
				define: {
					freezeTableName: true,	// do not add "s" to table names
					timestamps: false
				},
				host: "localhost",
				dialect: "mariadb",
				dialectOptions: {
					timezone: 'Etc/GMT-3', // remove time warnings
				}
				// logging: false
				//freezeTableName: true
			});
		}
		//const sequelize = new Sequelize('postgres://bdbiecpfkwqiqa:09f3c26b0e7d04bc9cf0a31f548e6c02b6d0cc4fef583d78fa5438eb44d0c9a7@ec2-54-217-218-80.eu-west-1.compute.amazonaws.com:5432/dbjg84geapj4kl');
		//const sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/postgres');

		sequelize.authenticate().then(() => {
			console.log('Connection has been established successfully.');
		}).catch(err => {
			console.error('Unable to connect to the database:', err);
		});

		return sequelize;
	}
}
