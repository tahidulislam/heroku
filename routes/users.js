const express = require('express')

const router = express.Router()

const bcrypt = require('bcryptjs')

let User = require('../models/user')

// user get request
router.get('/register', (req, res) => {
	res.render('register', {
		title: 'Register'
	})
})

// user post request
router.post('/register', (req, res) => {
	const name = req.body.name
	const username = req.body.username
	const email = req.body.email
	const password = req.body.password 
	const password2 = req.body.password2 
	//validation
	req.checkBody('name', 'Name is required').notEmpty()
	req.checkBody('username', 'Userame is required').notEmpty()
	req.checkBody('email', 'Email is required').notEmpty()
	req.checkBody('email', 'Email is not valid').isEmail()
	req.checkBody('password', 'Password is required').notEmpty()
	req.checkBody('password2', 'Password is not match').equals(req.body.password)
	// check error during validation
	let errors = req.validationErrors()
	if (errors) {
		res.render('register', {
			errors: errors
		})
	} else {
		let newUser = new User({
			name: name,
			username: username,
			email: email,
			password: password
		})
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) {
					console.log(err)
				}
				newUser.password = hash
			})
		})
		newUser.save((err) => {
			if (err) {
				console.log(err)
				return
			} else {
				req.flash('success', 'Your are now registered & can login')
				res.redirect('/users/login')
			}
		})
	}
})

// login get request
router.get('/login', (req, res) => {
	res.render('login', {
		title: 'Login'
	})
})

module.exports = router