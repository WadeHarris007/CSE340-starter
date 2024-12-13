//Bring into scope
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const invcss = "inv"

const invCont = {};

/**
 * Build inventory by classification view 
 */

invCont.buildByClassificationId = async (req, res, next) => {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = await invModel.getClassificationName(classification_id)
    let title = className + " vehicles"
    res.render("./inventory/classification", {
        title: title,
        nav,
        grid,
    })
}

/**
 * Build vehicle detail by invId view 
 */

invCont.buildByInvId = async (req, res, next) => {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const details = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    const vehicleName = data.inv_make + ' ' + data.inv_model
    let title = vehicleName + " Details"
    res.render("./inventory/details", {
        title: title,
        nav,
        details,
    })
}

/**
 * Build vehicle detail by invId view 
 */

invCont.buildManagement = async (req, res, next) => {
    let nav = await utilities.getNav()
    let select = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Management",
        nav,
    })
}

/**
 * Build the add classification view 
 */

invCont.buildaddClassification = async (req, res, next) => {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/**
 * Build the add inventory view 
 */

invCont.buildAddInventory = async (req, res, next) => {
    let nav = await utilities.getNav()
    let select = await utilities.buildSelectClassification(null)
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        selectClassification: select
    })
}

/**
 * Build add inventory view 
 */

invCont.buildUpdateInventory = async (req, res, next) => {
    const inv_id = parseInt(req.params.invId);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInvId(inv_id);
    const select = await utilities.buildSelectClassification(itemData.classification_id);
    const itemName = `${itemData.in_make} ${itemData.in_model}`;
    let title = "Edit " + itemName;
    res.render("./inventory/update-inventory", {
        title: title,
        nav,
        selectClassification: select,
        pagecss: invcss,
        errors: null,
        inv_id: itemData.inv_id,
        in_make: itemData.in_make,
        in_model: itemData.in_model,
        inv_year: parseInt(itemData.inv_year),
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: parseFloat(itemData.inv_price),
        in_miles: parseInt(itemData.in_miles),
        inv_color: itemData.inv_color,
    });
}

/**
 * Build add inventory view 
 */

invCont.buildDeleteInventory = async (req, res, next) => {
    const inv_id = parseInt(req.params.invId);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInvId(inv_id);
    const itemName = `${itemData.in_make} ${itemData.in_model}`;
    let title = "Delete " + itemName;
    res.render("./inventory/delete-inventory", {
        title: title,
        nav,
        selectClassification: select,
        pagecss: invcss,
        errors: null,
        inv_id: itemData.inv_id,
        in_make: itemData.in_make,
        in_model: itemData.in_model,
        inv_year: parseInt(itemData.inv_year),
        inv_price: parseFloat(itemData.inv_price),
        in_miles: parseInt(itemData.in_miles),
    });
}

/**
 * Add new classification
 */

invCont.addClassification = async (req, res, next) => {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;

    try {
        const result = await invModel.addClassification(classification_name);

        if (result) {
            req.flash(
                "success",
                `New category added ${classification_name}`);

            return res.status(201).redirect("/inv/");
            next();
        }
    } catch (error) {
        req.flash("notice", "Sorry, add classification failed.");
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            pagecss: invcss,
            errors: null,
            classification_name,
        });
        return;
    }
}



/**
 * Add new inventory
 */

invCont.addInventory = async (req, res) => {
    let nav = await utilities.getNav();    

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
        classification_id } = req.body;

    try {
        const result = await invModel.addInventory(
            in_make,
            in_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            in_miles,
            inv_color,
            classification_id);

        if (result) {
            req.flash(
                "success",
                `New inventory added ${in_make} ${in_model}`
            );

            return res.status(201).redirect("/inv/");
            next();
        }
    } catch (error) {
        req.flash("notice", "Sorry, add inventory failed.");
        let select = await utilities.buildSelectClassification(classification_id);
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            pagecss: invcss,
            errors: null,
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
        });
        return;
    }
}

/**
 * Update inventory
 */

invCont.updateInventory = async (req, res) => {
    let nav = await utilities.getNav();

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
        inv_id } = req.body;

    try {
        const result = await invModel.updateInventory(
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
            inv_id);

        if (result) {
            req.flash(
                "success",
                `${in_make} ${in_model} updated.`
            );

            return res.status(200).redirect("/inv/");
            next();
        }
    } catch (error) {
        req.flash("notice", "Sorry, update inventory failed.");
        const select = await utilities.buildSelectClassification(classification_id);
        const itemName = `${in_make} ${in_model}`;
        let title = "Edit " + itemName;
        res.status(500).render("./inventory/update-inventory", {
            title: title,
            nav,
            selectClassification: select,
            pagecss: invcss,
            errors: null,
            inv_id: inv_id,
            in_make: in_make,
            in_model: in_model,
            inv_year: parseInt(inv_year),
            inv_description: inv_description,
            inv_image: inv_image,
            inv_thumbnail: inv_thumbnail,
            inv_price: parseFloat(inv_price),
            in_miles: parseInt(in_miles),
            inv_color: inv_color,
        });
        return;
    }
}

/**
 * Delete inventory
 */

invCont.deleteInventory = async (req, res) => {
    let nav = await utilities.getNav()

    const { in_make, in_model, inv_id } = req.body

    try {
        const result = await invModel.deleteInventory(inv_id)

        if (result) {
            req.flash(
                "success",
                `${in_make} ${in_model} Deleted.`
            );

            return res.status(200).redirect("/inv/")
            next();
        }
    } catch (error) {
        req.flash("notice", "Sorry, delete inventory failed.")
        const itemName = `${in_make} ${in_model}`
        let title = "Delete " + itemName
        res.status(500).render("./inventory/delete-inventory", {
            title: title,
            nav,
            pagecss: invcss,
            errors: null,
            inv_id: itemData.inv_id,
            in_make: itemData.in_make,
            in_model: itemData.in_model,
            inv_year: parseInt(itemData.inv_year),
            inv_price: parseFloat(itemData.inv_price),
            in_miles: parseInt(itemData.in_miles),
        })
        return;
    }
}

/**
 * Return Inventory by Classification As JSON 
 */

invCont.getInventory = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (invData.length > 0) {
        return res.json(invData)
    } else {
        return res.status(404).json()
    }
}

module.exports = invCont;