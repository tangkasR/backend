import { Movies } from '../models/Models.js';
import path from 'path';
import fs from 'fs';

export const getMovies = async (req, res) => {
  try {
    const movies = await Movies.findAll();
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
  }
};
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movies.findOne({
      where: {
        id: req.params.id
      }
    });
    res.json(movie);
  } catch (error) {
    console.log(error);
  }
};
export const saveMovie = (req, res) => {
  if (req.file === null) {
    return res.status(400).json({ msg: 'no such file' });
  }
  const title = req.body.title;
  const file = req.files.file;
  const release_date = req.body.release_date;
  const date_playing = req.body.date_playing;

  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
  const allowedType = ['.png', '.jpeg', '.jpg'];
  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({ msg: 'Invalid image' });
  }

  file.mv(`./public/images/${fileName}`, async err => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Movies.create({
        title: title,
        image: fileName,
        url: url,
        release_date: release_date,
        date_playing: date_playing
      });
      res.status(201).json({ msg: 'Movie created successfuly' });
    } catch (error) {
      console.log(error.message);
    }
  });
};
export const updateMovie = async (req, res) => {
  const movie = await Movies.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!movie) return res.status(404).json({ msg: 'No data found' });

  let fileName = '';

  if (!req.files) {
    fileName = movie.image;
  } else {
    const file = req.files.file;
    const ext = path.extname(file.name);
    const allowedType = ['.png', '.jpeg', '.jpg'];

    fileName = file.md5 + ext;

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid image' });
    }

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, err => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const title = req.body.title;
  const release_date = req.body.release_date;
  const date_playing = req.body.date_playing;
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
  try {
    await Movies.update(
      {
        title: title,
        image: fileName,
        url: url,
        release_date: release_date,
        date_playing: date_playing
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).json({ msg: 'Movie updated successfuly' });
  } catch (error) {
    console.log(error.message);
  }
};
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movies.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!movie) return res.status(404).json({ msg: 'No data found' });
    try {
      const filepath = `./public/images/${movie.image}`;
      fs.unlinkSync(filepath);
      await Movies.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ msg: 'movie deleted successfuly' });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
  }
};
