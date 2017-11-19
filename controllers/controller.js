const express = require("express");
const axios = require("axios");
// const axios = require("axios"); //replace with request?
const cheerio = require("cheerio");
const db = require("../models/");

const maxArticles = 20;

module.exports = (app) => {
  // Scrape NY Times Website
  app.get("/scrape", (req, res) => {

    axios.get("https://www.nytimes.com/").then(response => {
      const $ = cheerio.load(response.data);

      $("article h2").each( function (i, element) {
        if (i < maxArticles) {
          let result = {};

          result.title = $(this)
            .children("a")
            .text();

          result.link = $(this)
            .children("a")
            .attr("href");

          db.Article
            .create(result)
            .then(dbArticle => {if (i===19) res.json('Scraped')} )
            .catch(err => res.json(err) );
        }
      });

    });
  });

  // Retrieve the articles in collection 
  app.get("/", (req, res) => {
    db.Article
      .find({})
      .then(dbArticle => { 
        res.render('index', {data: dbArticle});
      })
      .catch(err => res.json(err) );
  });

  // Save an article
  app.post("/save/:id", function(req, res) {
    db.Article.update(
      { _id: req.params.id }, 
      { $set: { saved: true }}, 
      (err, data) => {
        if (err) throw err;
        res.send("Saved");
      }
    );
  });

  // Unsave an article
  app.post("/unsave/:id", function(req, res) {
    db.Article.update(
      { _id: req.params.id }, 
      { $set: { saved: false }}, 
      (err, data) => {
        if (err) throw err;
        res.send("Unsaved");
      }
    );
  });

  // Retrieve article information to save note
  app.get("/articles/:id", (req, res) => {
    db.Article
      .findOne({ _id: req.params.id })
      .populate("note")
      .then(dbArticle => res.json(dbArticle) )
      .catch(err => res.json(err) );
  });

  // Set the note information
  app.post("/articles/:id", function(req, res) {
    db.Note
      .create(req.body)
      .then( dbNote =>
        db.Article.findOneAndUpdate({ _id: req.params.id }, 
          { note: dbNote._id }, { new: true }) )
      .then(dbArticle => res.json(dbArticle) )
      .catch(err => res.json(err) );
  });
};
