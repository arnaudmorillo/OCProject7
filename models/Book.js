const mongoose = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose);
const uniqueValidator = require("mongoose-unique-validator");

// Book schema for database
const bookSchema = mongoose.Schema({
	userId: { type: String, required: true },
	// Unicity criteria on the book title
	title: { type: String, required: true, unique: true },
	author: { type: String, required: true },
	imageUrl: { type: String, required: true },
	year: { type: Number, required: true },
	genre: { type: String, required: true },
	ratings: [
		{
			userId: { type: String, required: true },
			grade: { type: Int32, required: true, min: 0, max: 5 },
		},
	],
	averageRating: { type: Number, default: 0 },
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Book", bookSchema);
