const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const limiter = require("../middleware/rate-limiter");

// routes to create an account and to log into one
router.post("/signup", limiter, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
