const multer = require("multer");
const storage = multer.memoryStorage();

// multer stores the iamge in memory storage so sharp can use it
module.exports = multer({ storage: storage }).single("image");
