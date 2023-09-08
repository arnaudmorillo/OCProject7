const Book = require("../models/Book");
const fs = require("fs");

////////// Add new book as logged in user
exports.createBook = (req, res, next) => {
	const bookObject = JSON.parse(req.body.book);
	delete bookObject._id;
	delete bookObject._userId;
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
	});
	// Saving new book to database
	book
		.save()
		.then(() => res.status(201).json({ message: "Livre ajouté !" }))
		.catch((error) => res.status(400).json({ error }));
};

////////// Modify a book as logged in user. Book must have been published by this user
exports.modifyBook = (req, res, next) => {
	// If image is modified, the request is parsed to be an object
	const bookObject = req.file
		? {
				...JSON.parse(req.body.book),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	delete bookObject._userId;
	// Looking in database for the object to modify
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			// Storing names of previous image and new image
			const filename = book.imageUrl.split("/images/")[1];
			const newFilename = req.file ? req.file.filename : filename;
			if (book.userId != req.auth.userId) {
				res
					.status(401)
					.json({ message: "Vous n'êtes pas autorisé à modifier ce livre !" });
			} else {
				// Updating book in database
				Book.updateOne(
					{ _id: req.params.id },
					{ ...bookObject, _id: req.params.id }
				)
					.then(() => {
						res.status(200).json({ message: "Livre mis à jour !" });
						// if a new image file is used, the previous one is deleted from server
						if (
							filename !== newFilename &&
							fs.existsSync(`images/${filename}`)
						) {
							fs.unlink(`images/${filename}`, (err) => {
								if (err) throw err;
							});
						}
					})
					.catch((error) => res.status(401).json({ error }));
			}
		})
		.catch((error) => res.status(400).json({ error }));
};

////////// Delete a book
exports.deleteBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			// Check if the user asking to delete is the one who created the book
			if (book.userId != req.auth.userId) {
				res
					.status(401)
					.json({ message: "Vous n'êtes pas autorisé à supprimer ce livre !" });
			} else {
				// Delete image from server
				const filename = book.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					//Delete book from database
					Book.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ message: "Livre supprimé !" }))
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

////////// Getting the book to display on webpage
exports.getOneBook = (req, res, next) => {
	// based on the id in url
	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(404).json({ error }));
};

////////// Getting all the books to display them on main page
exports.getAllBooks = (req, res, next) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }));
};

////////// Add a new rating to a book
exports.addRating = (req, res, next) => {
	// Find the book in database
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			// Check if user already rated this book
			if (book.ratings.find((user) => user.userId === req.auth.userId)) {
				res.status(401).json({ message: "Vous avez déjà noté ce livre !" });
			} else {
				// Calculate new average rating
				const newRatingsNumber = book.ratings.length + 1;
				const previousRatingsSum = book.ratings
					.map((item) => item.grade)
					.reduce((prev, next) => prev + next);
				const newRatingsSum = previousRatingsSum + req.body.rating;
				const newAverageUnrounded = newRatingsSum / newRatingsNumber;
				// The average is rounded to 3 numbers
				const newAverage = newAverageUnrounded.toPrecision(3);
				// Updating book in database with new rating
				Book.updateOne(
					{ _id: req.params.id },
					{
						$push: {
							ratings: { userId: req.auth.userId, grade: req.body.rating },
						},
						averageRating: newAverage,
					}
				).then(() => {
					// Getting the updated book to display on webpage
					Book.findOne({ _id: req.params.id })
						.then((book) => {
							res.status(200).json(book);
						})
						.catch((error) => res.status(404).json({ error }));
				});
			}
		})
		.catch((error) => res.status(404).json({ error }));
};

////////// Get the 3 best rated books
exports.bestRating = (req, res, next) => {
	// Get all books in database
	Book.find()
		.then((books) => {
			// Sort books by average rating in descending order
			const orderedBooks = books.sort(
				(a, b) => b.averageRating - a.averageRating
			);
			// Keep the first 3 books and return them to the app
			const bestBooks = orderedBooks.slice(0, 3);
			res.status(200).json(bestBooks);
		})
		.catch((error) => res.status(400).json({ error }));
};
