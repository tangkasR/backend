import db from '../config/Database.js';
import { Sequelize } from 'sequelize';

const { DataTypes } = Sequelize;

export const Admin = db.define(
  'admin',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    token: {
      type: DataTypes.TEXT
    }
  },
  {
    freezeTableName: true
  }
);

export const Movies = db.define(
  'movies',
  {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    release_date: DataTypes.DATE,
    date_playing: DataTypes.DATE
  },
  {
    freezeTableName: true
  }
);
