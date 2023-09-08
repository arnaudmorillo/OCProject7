const rateLimiter = require("express-rate-limit");

// Limit the amount of request to 3 per 20 seconds
module.exports = rateLimiter({
	max: 5,
	windowMS: 20000, // 20 seconds
	message: "Trop de tentatives. Réessayez dans quelques instants !",
});
