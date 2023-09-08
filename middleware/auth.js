const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

// Decode the token to retrieve the userId
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, secrets.jwtSecret);
		const userId = decodedToken.userId;
		req.auth = {
			userId: userId,
		};
	} catch (error) {
		res.status(401).json({ error });
	}
	next();
};
