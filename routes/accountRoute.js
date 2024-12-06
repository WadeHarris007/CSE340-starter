// Bring into scope
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// This route will build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// This route will build the register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// This route will handle a new registration
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
// router.post(
//     "/login",
//     (req, res) => {
//         res.status(200).send('login process')
//     });
router.post("/login", utilities.handleErrors(accountController.buildLogin))

module.exports = router;