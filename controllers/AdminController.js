import { Admin } from '../models/Models.js';
import argon2 from 'argon2';

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password != confirmPassword) {
    return res
      .status(400)
      .json({ msg: 'password dengan konfirmasi password tidak sama' });
  }
  const hashPassword = await argon2.hash(password);
  try {
    await Admin.create({
      name: name,
      email: email,
      password: hashPassword
    });
    res.status(201).json({ Admin });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  const admin = await Admin.findOne({
    where: {
      email: req.body.email
    }
  });
  if (!admin) return res.status(404).json({ msg: 'Email atau password salah' });
  const match = await argon2.verify(admin.password, req.body.password);
  if (!match) return res.status(404).json({ msg: 'Email atau password salah' });
  await Admin.update(
    {
      token: process.env.ACCESS_TOKEN_SECRET
    },
    {
      where: {
        email: req.body.email
      }
    }
  );
  res.status(200).json({ admin });
};

export const logout = async (req, res) => {
  await Admin.update(
    {
      token: null
    },
    {
      where: {
        id: req.params.id
      }
    }
  );
};
