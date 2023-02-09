const router = require("express").Router();

const { register, login } = require("../controllers/auth.controllers");

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
