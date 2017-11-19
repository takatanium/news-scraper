const express = require('express');
const axios = require('axios');
// const axios = require("axios"); //replace with request?
const cheerio = require('cheerio');
const request = require('request');
const db = require('../models/');

const maxArticles = 20;

module.exports = (app) => {
  // Scrape NY Times Website
  app.get('/scrape', (req, res) => {

    axios.get('https://www.nytimes.com/').then(response => {
      const $ = cheerio.load(response.data);
      $('article h2').each( function (i, element) {
        if (i < maxArticles) {
          let result = {};

          result.title = $(this)
            .children('a')
            .text();

          result.link = $(this)
            .children('a')
            .attr('href');

          db.Article
            .create(result)
            .then(dbArticle => res.json('Scraped') )
            .catch(err => res.json(err) );
        }
      });

    });
  });

  // Retrieve the articles in collection 
  app.get('/', (req, res) => {
    db.Article
      .find({})
      .populate('note')
      .then(dbArticle => { 
        res.render('index', {data: dbArticle});
      })
      .catch(err => res.json(err) );
  });

  // Save an article
  app.post('/save/:id', function(req, res) {
    db.Article.update(
      { _id: req.params.id }, 
      { $set: { saved: true }}, 
      (err, data) => {
        if (err) throw err;
        res.send('Saved');
      }
    );
  });

  // Unsave an article
  app.post('/unsave/:id', function(req, res) {
    db.Article.update(
      { _id: req.params.id }, 
      { $set: { saved: false }}, 
      (err, num) => {
        if (err) throw err;
        res.send('Unsaved');
      }
    );
  });

  // Add the note information
  app.post('/add/:id', function(req, res) {
    db.Note
      .create(req.body)
      .then( dbNote => {
        db.Article.update(
          { _id: req.params.id }, 
          { $set: {note: dbNote._id} },
          {multi: true},
          (err, num) => {
            if (err) throw err;
            res.send('Added');
          }
        )
      })
      .catch(err => res.json(err) );
  });

  // Subtract the note
  app.post('/sub/:id1/:id2', function(req, res) {
    db.Note.remove(
      { _id: req.params.id2 }, 
      (err, num) => {
        if (err) throw err;
      })
      .then( dbNote => {
        db.Article.update(
          { _id: req.params.id1 }, 
          { $unset: {note: ''} },
          (err, num) => {
            if (err) throw err;
            res.send('Sutracted');
          }
        )
      })
      .catch(err => res.json(err) );
  });

  // Edit the note information
  app.post('/edit/:id', function(req, res) {
    db.Note.update(
      { _id: req.params.id }, 
      { $set: { text: req.body.text }}, 
      (err, data) => {
        if (err) throw err;
        res.send('Edited');
      }
    )
  });  

};
