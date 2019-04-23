let mongoose = require('mongoose')

// article schema
let articleSchema = mongoose.Schema({
	title: {
		type: 'string',
		required: true
	},
	author: {
		type: 'string',
		required: true
	},
	body: {
		type: 'string',
		required: true
	}
})

// export model
let Article = module.exports = mongoose.model('Article', articleSchema)