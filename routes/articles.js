const express = require('express')
const router = express.Router()

// bring in models
let Article = require('../models/article')



//get add_artle route
router.get('/add', (req, res) => {
	res.render('add_article', {
		title: 'Add Article'
	})
})

//post data and save to mongodb
router.post('/add', (req, res) => {
	// validation
	req.checkBody('title', 'Title is required').notEmpty()
	req.checkBody('author', 'Author is required').notEmpty()
	req.checkBody('body', 'Body is required').notEmpty()
	// get error during validation
	let errors = req.validationErrors()
	if (errors) {
		res.render('add_article', {
			title: 'Add Article',
			errors: errors
		})
	} else {
		let article = new Article() // include article model
		article.title = req.body.title
		article.author = req.body.author
		article.body = req.body.body

	   //ridirect page after data submission
		article.save((err) => {
			if(err) {
				console.log('err')
			} else {
				req.flash('success', 'Article Added')
				res.redirect('/')
			}
		})
	}
})

// get edit article route
router.get('/edit/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('edit-article', {
			article:article
		})
	})
})

// post editing data to mongodb & riderect page
//post data and save to mongodb
router.post('/edit/:id', (req, res) => {
	let article = {} // empty
	article.title = req.body.title
	article.author = req.body.author
	article.body = req.body.body

	let query = {_id: req.params.id}

   //ridirect page after data submission
	Article.update(query, article, (err) => {
		if(err) {
			console.log('err')
		} else {
			req.flash('success', 'Article Updated')
			res.redirect('/')
		}
	})
})

// delete route
router.delete('/:id', (req, res) => {
	let query = {_id: req.params.id}
	Article.remove(query, (err) => {
		if (err) {
			console.log(err)
		}
		res.send('Success')
	})
})

// get single article route
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('single-article', {
			article:article
		})
	})
})


module.exports = router