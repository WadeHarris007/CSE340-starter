//Bring into scope
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.checkLogged, utilities.handleErrors(accountController.buildLogin))

// Route to build register view
router.get("/register", utilities.checkLogged, utilities.handleErrors(accountController.buildRegister))

// Route to update account view
router.get("/account-update", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))

// Route to build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Process new registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

// Process the update password request 
router.post(
    "/update-password",
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword))

// Process the update profile request
router.post(
    "/update-profile",
    regValidate.updateProfileRules(),
    regValidate.checkUpdateProfileData,
    utilities.handleErrors(accountController.updateProfile))

module.exports = router;