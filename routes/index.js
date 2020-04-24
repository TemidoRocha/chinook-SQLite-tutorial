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
  const sql = `SELECT
                trackid,
                tracks.name,
                artists.name AS artistName,
                albums.Title AS album,
                media_types.Name AS media,
                genres.Name AS genres,
                tracks.Milliseconds AS miliseconds,
                tracks.Bytes,
                tracks.UnitPrice AS price
              FROM
                tracks
              INNER JOIN albums ON Albums.AlbumId = tracks.AlbumId
              INNER JOIN artists ON artists.ArtistId = albums.ArtistId
              INNER JOIN media_types ON media_types.MediaTypeId = tracks.MediaTypeId
              INNER JOIN genres ON genres.GenreId = tracks.GenreId
              ORDER BY "artist name" AND
                        album AND
                        TrackId;`;

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
    // console.log(rows);
    res.render('customerDistribution', { rows });
  });
});

router.get('/avgGenreTimeSize', (req, res, next) => {
  const sql =
    'SELECT	genres.Name, round(avg(milliseconds / 60000),0)  avg_lengInMin, round(avg(bytes)*1e-6, 0) avg_sizeBytes FROM tracks INNER JOIN genres ON genres.GenreId = tracks.GenreId GROUP BY genres.Name;';

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('avgGenreTimeSize', { rows });
  });
});

//it is not closed because when I change view it doesn't restart ????
// close the database connection
// db.close();

module.exports = router;
