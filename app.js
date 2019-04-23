const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser= require('body-parser')
const expressValidator = require('express-validator')
const session = require('express-session')
const flash = require('connect-flash')

// connect mongodb and mongoose
mongoose.connect('mongodb://localhost:27017/nodekb', {useNewUrlParser: true})
let db = mongoose.connection

// interact with database
//check connection
 db.once('open', () => {
 	console.log('Connected to mongoDB')
 })
 // check for db error
 db.on('error', (err) => {
 	console.log(err)
 })



// init app
const app = express()

// add body parser
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// set up public (static folder)
app.use(express.static(path.join(__dirname, 'public')))

// express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

// express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next()
})

// express validator middleware
app.use(expressValidator({
	errorformatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']'
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		}
	}
}))

// view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// bring in models
let Article = require('./models/article')
let User = require('./models/user')

// get home route
app.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		if(err) {
			console.log(err)
		} else {	
			res.render('index', {
				title: 'articles',
				articles: articles
			})
		}
	})
})

//bring routes files
let articles = require('./routes/articles')
app.use('/articles', articles)
let users = require('./routes/users')
app.use('/users', users)

// run server
const port = process.env.PORT || 8080
app.listen(port, (req, res) => {
	console.log('server run on port' + port)
})