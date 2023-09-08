require("dotenv").config();

// Obtaining jwt secret key from .env file
module.exports = {
	jwtSecret: process.env.JWT_SECRET,
	dbMongo: process.env.DB_MONGO,
	dbUsername: process.env.DB_USERNAME,
	dbPassword: process.env.DB_PASSWORD,
	dbHost: process.env.DB_HOST,
	dbOptions: process.env.DB_OPTIONS,
};
