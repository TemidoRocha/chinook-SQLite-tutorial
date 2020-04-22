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
    console.log(rows);
    res.render('index', { rows });
  });
});

module.exports = router;
