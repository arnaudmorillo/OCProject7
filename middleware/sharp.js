const sharp = require("sharp");
const fs = require("fs");

module.exports = async (req, res, next) => {
	if (!req.file) return next();

	// If directory images does not exist, create it
	fs.access("images", (error) => {
		if (error) {
			fs.mkdirSync("images");
		}
	});

	// Deletes file extension from filename
	const nameNoExtension = req.file.originalname.indexOf(".")
		? req.file.originalname.substring(0, req.file.originalname.lastIndexOf("."))
		: req.file.originalname;
	// Delete all special characters
	const nameNoSpecial = nameNoExtension.replace(/[^a-zA-Z0-9 _-]/g, "");
	// Replace space with _
	const name = nameNoSpecial.split(" ").join("_");
	// Add timestamp to make filename unique and add webp extension
	const newFilename = name + Date.now() + ".webp";
	// Resize, optimize quality and save file to server
	await sharp(req.file.buffer)
		.resize({ height: 568 })
		.webp({ quality: 20 })
		.toFile(`images/${newFilename}`);
	req.file.filename = newFilename;
	next();
};
