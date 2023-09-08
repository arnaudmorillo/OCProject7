const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secrets = require("../config/secrets");

////////// Create a new account
exports.signup = (req, res, next) => {
	const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const regPwd = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
	// Check if email has correct format
	if (regEmail.test(req.body.email) == false) {
		res.status(400).json({ message: "L'adresse email n'est pas valide !" });
	}
	// Check if password has 1 uppercase, 1 lowercase, 1 number, 1 special character and is at least 8 characters long
	else if (regPwd.test(req.body.password) == false) {
		res.status(400).json({
			message:
				"Le mot de passe doit contenir une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et doit avoir au moins 8 caractères",
		});
	} else {
		// hash the password
		bcrypt
			.hash(req.body.password, 10)
			.then((hash) => {
				const user = new User({
					email: req.body.email,
					password: hash,
				});
				// Store new user in database
				user
					.save()
					.then(() => res.status(201).json({ message: "Utiliseur créé !" }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(500).json({ error }));
	}
};

////////// Log in a user
exports.login = (req, res, next) => {
	// Check if user has an account in database
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user === null) {
				res
					.status(401)
					.json({ message: "Identifiant ou mot de passe incorrect !" });
			} else {
				// ompare password used and hash in database
				bcrypt
					.compare(req.body.password, user.password)
					.then((valid) => {
						if (!valid) {
							res
								.status(401)
								.json({ message: "Identifiant ou mot de passe incorrect !" });
						} else {
							// if email and password are correct, send userId and token to client
							res.status(200).json({
								userId: user._id,
								token: jwt.sign({ userId: user._id }, secrets.jwtSecret, {
									expiresIn: "24h",
								}),
							});
						}
					})
					.catch((error) => res.status(500).json({ error }));
			}
		})
		.catch((error) => res.status(500).json({ error }));
};
