const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const secrets = require("./config/secrets");

const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

const app = express();

// connect the server to the database
mongoose
	.connect(
		`${secrets.dbMongo}${secrets.dbUsername}:${secrets.dbPassword}${secrets.dbHost}${secrets.dbOptions}`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// Allow CORS requests
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

// API url for books routes, user routes and images server storage
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
