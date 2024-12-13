// Bring into scope
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inv-validation')

// This route will build the inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// This route will build vehicle details view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route to build edit inventory view
router.get(
    "/edit/:invId",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(invController.buildUpdateInventory))

// Route to build delete inventory view
router.get(
    "/delete/:invId",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(invController.buildDeleteInventory))

// Route to build inventory management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(invController.buildManagement))

// This route will build the "add classification" view
router.get("/add-classification",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(invController.buildAddClassification))

// This route will build the add inventory view
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkClientType,
    utilities.handleErrors(invController.buildAddInventory))

// Route to handle inventory JSON response
router.get(
    "/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.getInventory))

// This route will handle a new classification
router.post(
    '/add-classification',
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))

// This route will handle a new inventory
router.post(
    '/add-inventory',
    //invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory))

    // Route to handle update inventory
router.post(
    '/update-inventory',
    invValidate.inventoryUpdateRules(),
    invValidate.checkInventoryUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to handle delete inventory
router.post(
    '/delete-inventory',    
    utilities.handleErrors(invController.deleteInventory))

module.exports = router;