// Bring into scope
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {};

/**
 * Classification validation rules 
 */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .notEmpty()
            .withMessage("Please provide a classification name.")
            .custom(async (classification_name) => {
                const classification = await invModel.checkExistingClassification(classification_name)
                if (classification) {
                    throw new Error("Classification exists. Please choose other classification name.")
                }
            }),
    ]
}

/**
 * Inventory validation rules 
 */
validate.inventoryRules = () => {
    return [
        body("in_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a manufactorer name."),

        body("in_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a model name."),

        body("inv_year")
            .trim()
            .isNumeric()
            .withMessage("Please provide a year.")
            .custom((inv_year) => {
                let year = parseInt(inv_year);
                if (year < 1870 || year > 2999) {
                    throw new Error("Year should be between 1870 or more. Please choose other year.")
                }
            }),

        body("inv_description")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a description."),

        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a image path."),

        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path."),

        body("inv_price")
            .trim()
            .isNumeric()
            .withMessage("Please provide a price."),

        body("in_miles")
            .trim()
            .isNumeric()
            .withMessage("Please provide miles."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color name."),

        body("classification_id")
            .trim()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please provide a classification."),
    ]
}

/**
 * Inventory validation rules 
 */
validate.inventoryUpdateRules = () => {
    return [
        body("in_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a manufactorer name."),

        body("in_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a model name."),

        body("inv_year")
            .trim()
            .isNumeric()
            .withMessage("Please provide a year.")
            .custom(async (inv_year) => {
                const year = parseInt(inv_year)
                if (year < 1870 || year > 2999) {
                    throw new Error("Year should be between 1870 or more. Please choose other year.")
                }
            }),

        body("inv_description")
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a description."),

        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a image path."),

        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path."),

        body("inv_price")
            .trim()
            .isFloat()
            .withMessage("Please provide a price."),

        body("in_miles")
            .trim()
            .isFloat()
            .withMessage("Please provide miles."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color name."),

        body("classification_id")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification."),

        body("inv_id")
            .trim()            
            .isLength({ min: 1 })
            .withMessage("Please provide a inventory identification."),
    ];
}



/**
 * Check data and return errors or continue to add classification
 */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = [];
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            pagecss: "inv",
            classification_name,
        });
        return
    }
    next();
}



/**
 * Check data and return errors or continue to add inventory
 */
validate.checkInventoryData = async (req, res, next) => {
    const {
        in_make,
        in_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        in_miles,
        inv_color,
        classification_id
    } = req.body;

    let errors = [];
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.buildSelectClassification(classification_id)

        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            pagecss: "inv",
            selectClassification: select,
            in_make,
            in_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            in_miles,
            inv_color,
        })
        return;
    }
    next();
}

/**
 * Check data and return errors or continue to update inventory
 */
validate.checkInventoryUpdateData = async (req, res, next) => {
    const {
        in_make,
        in_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        in_miles,
        inv_color,
        classification_id,
        inv_id
    } = req.body;

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.buildSelectClassification(classification_id)

        res.status(400).render("./inventory/update-inventory", {
            errors,
            title: "Edit" + in_make + in_model,
            nav,
            pagecss: invcss,
            selectClassification: select,
            inv_id: inv_id,
            in_make: in_make,
            in_model: in_model,
            inv_year: parseInt(inv_year),
            inv_description: inv_description,
            inv_image: inv_image,
            inv_thumbnail: inv_thumbnail,
            inv_price: parseFloat(inv_price),
            in_miles: parseInt(in_miles),
            inv_color: inv_color
        })
        return;
    }
    next();
}

module.exports = validate;