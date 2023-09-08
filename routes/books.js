const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp");
const limiter = require("../middleware/rate-limiter");
const router = express.Router();

const booksCtrl = require("../controllers/books");

// routes to create modify or delete a book. They all need to be authentified
router.post("/", limiter, auth, multer, sharp, booksCtrl.createBook);
router.put("/:id", limiter, auth, multer, sharp, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);

// routes to get all books, one book and the best 3 books
router.get("/", booksCtrl.getAllBooks);
router.get("/bestrating", booksCtrl.bestRating);
router.get("/:id", booksCtrl.getOneBook);

// route to post a new rating with user authentification
router.post("/:id/rating", auth, booksCtrl.addRating);

module.exports = router;
