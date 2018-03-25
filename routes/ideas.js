const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const Idea = require('../models/Idea')

const {ensureAuthenticated} = require('../helpers/auth');


router.get("/", ensureAuthenticated,(req, res) => {
  Idea.find({user: req.user.id})
    .sort({ date: "desc" })
    .exec()
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

router.post("/", ensureAuthenticated,(req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Video idea added");
      res.redirect("/ideas");
    });
  }
});

router.get("/add", ensureAuthenticated,(req, res) => {
  res.render("ideas/add");
});

router.get("/edit/:id", ensureAuthenticated,(req, res) => {
  Idea.findOne({ _id: req.params.id })
    .exec()
    .then(idea => {
      if(idea.user !== req.user.id){
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/ideas');
      }else{
        res.render("ideas/edit", {
          idea: idea
        });
      }
    });
});

router.put("/:id", ensureAuthenticated,(req, res) => {
  Idea.findOne({ _id: req.params.id })
    .exec()
    .then(idea => {
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save().then(idea => {
        req.flash("success_msg", "Video idea updated");
        res.redirect("/ideas");
      });
    });
});

router.delete("/:id", ensureAuthenticated,(req, res) => {
  Idea.findByIdAndRemove({ _id: req.params.id })
    .exec()
    .then(idea => {
      req.flash("success_msg", "Video idea removed");
      res.redirect("/ideas");
    });
});




module.exports = router;