/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************

 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")



/**
 * Middleware
 */

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Express Messages Middleware

app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(utilities.checkJWTToken)

/**
 * EJS Configuration
 */

app.use(require("./routes/static"))
app.set("view engine", "ejs")
app.use(require("express-ejs-layouts"))
app.set("layout", "./layouts/layout")

/**
 * Routes
 */

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Error Route
app.get("/error", utilities.handleErrors(baseController.InternalServerError))

// Inventory Routes
app.use("/inv", require("./routes/inventoryRoute"))

// Account Routes
app.use("/account", require("./routes/accountRoute"))

// Not Found Route
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/**
 * Express Error Handler
 */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?'
  req.flash(
    "notice",
    message
)
  res.render("errors/error", {
    title: err.status || 'Server Error',    
    pagecss: null,
    nav
  })
})

/**
 * Local Server Information
 * Values from .env (environment) file
 */

const port = process.env.PORT
const host = process.env.HOST
const appMessage = (host) ?
  `App listening on http://${host}:${port}` :
  "App is up and running";

/**
 * Log statement to confirm server operation
 */
app.listen(port, () => {
  console.log(appMessage)
});