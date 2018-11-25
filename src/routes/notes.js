const router = require('express').Router();
const Note = require('../models/note');
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes', isAuthenticated, async (req, res) => {
	const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
	res.render('notes/list', { notes });
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
	const { title, description } = req.body;
	const errors = [];
	if(!title){
		errors.push({text: 'Please write a title'});
	}
	if(!description){
		errors.push({text: 'Please write a description'});
	}
	if(errors.length > 0){
		res.render('notes/add', {
			errors,
			title,
			description
		});
	} else {
		const newNote = new Note({title, description});
		newNote.user = req.user.id;
		await newNote.save();
		req.flash('success_msg', 'Note Added Successfully');
		res.redirect('/notes');
	}
});

router.get('/notes/add', isAuthenticated, (req, res) => {
	res.render('notes/add');
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
	const n = await Note.findById(req.params.id);
	res.render('notes/edit', {
		n
	});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
	const {title, description} = req.body;
	await Note.findByIdAndUpdate(req.params.id, {title, description});
	req.flash('success_msg', 'Note update Successfully');
	res.redirect('/notes')
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Note delete Successfully');
	res.redirect('/notes');
});

module.exports = router;