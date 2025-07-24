const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");

router
  .route("/signup")
  .get(userController.renderSignupForm) //for getting signup form
  .post(wrapAsync(userController.signup)); //for signup

router
  .route("/login")
  .get(userController.renderLoginForm) //For getting login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  ); //for login

router.get("/logout", userController.logout);

module.exports = router;
