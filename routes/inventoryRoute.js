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

// This route will build the inventory management view
router.get("/management", utilities.handleErrors(invController.buildManagement))

// This route will build the "add classification" view
router.get("/add-classification", utilities.handleErrors(invController.buildaddClassification))

// This route will build the add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

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


module.exports = router;