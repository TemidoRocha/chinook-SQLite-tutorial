'use strict';

const { Router } = require('express');
const router = new Router();

const sqlite3 = require('sqlite3').verbose();

// open the database
const db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

router.get('/', (req, res, next) => {
  const sql = `SELECT PlaylistId as id, Name as name FROM playlists`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    // console.log(rows);
    res.render('index', { rows });
  });
});

router.get('/customerDistribution', (req, res, next) => {
  const sql = `SELECT DISTINCT Country, COUNT(*) as count
              FROM customers
              GROUP BY Country;`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(rows);
    res.render('customerDistribution', { rows });
  });
});

//it is not closed because when I change view it doesn't restart ????
// close the database connection
// db.close();

module.exports = router;
