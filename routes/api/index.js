const router = require("express").Router();
const users = require("./users");
const thoughts = require("./thoughts");

router.use("/users", users);
// router.use("/thoughts", thoughts);

module.exports = router;
