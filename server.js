const bodyParser = requre ('bodyParser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {DATEBASE_URL, PORT} = REQUIRE('./config');
const {BlogPost} = require('./models');

const app =express();


//remember that app is 'shorthand' for using express
app.use(morgan('common'));
app.use(bodyParser.json());


mongoose.Promise = global.Promise;

//the GET portion
app.get('/posts', (req,res) => {
	BlogPost
		.find()
		.exec()
		.then(posts => {
			res.json(posts.map(post => post.apiRepr()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'something went wrong'});
		});
});

app.get('/post/:id', (req, res) => {
	BlogPost
		.findById(req.params.id)
		.exec()
		.then(post => res.json(post.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'something went wrong'});
		});
});


//the POST func
app.post('/posts', (req,res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message ='Missing\'${field}\' in request body'
			console.error(message);
			return res.status(400).send(message);
		}
	}

	BlogPost
		.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author 
		})
		.then(BlogPost => res.status(201).json(BlogPost.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'something went wrong'});
		});
});

//the DELETE portion
app.delete('/post/:id', (req, res) => {
	BlogPost
	.findByIdAndRemove(req.params.id)
	.exec()
	.then(() => {
		res.status(204).json({message:'success'});
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'something went wrong'});

	});
});

//the PUT portion







