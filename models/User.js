const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//User schema for database
const userSchema = mongoose.Schema({
	// Unicity criteria for email
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
