//Bring into scope
const utilities = require("../utilities")
// Define homecss
const homecss = "home"

const baseController = {};

baseController.buildHome = async (req, res) => {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav, pagecss: homecss, })
}

baseController.InternalServerError = async (req, res) => {
    res.render("index", { title: "Home", nav, pagecss: homecss, })
}

module.exports = baseController;
