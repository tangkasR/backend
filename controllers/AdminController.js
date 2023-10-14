import AdminModel from '../models/AdminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const {name, email, password, confirmPassword} = req.body;
  if (password !== confirmPassword) {
    return res.status (400).json ({
      msg: 'Password dan Konfirmasi Password tidak sama, silahkan ulang kembali',
    });
  }
  const salt = await bcrypt.genSalt ();
  const hashPassword = await bcrypt.hash (password, salt);
  try {
    await AdminModel.create ({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json ({AdminModel});
  } catch (error) {
    console.log (error);
    res.status (404).json ({msg: 'Register gagal, silahkan coba lagi'});
  }
};

export const login = async (req, res) => {
  try {
    const admin = await AdminModel.findAll ({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare (req.body.password, admin[0].password);
    if (!match) {
      return res.status (400).json ({msg: 'Email atau Password salah'});
    }

    const adminId = admin[0].id;
    const name = admin[0].name;
    const email = admin[0].email;

    const accessToken = jwt.sign (
      {adminId, name, email},
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '20s',
      }
    );
    const refreshToken = jwt.sign (
      {adminId, name, email},
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d',
      }
    );
    await AdminModel.update (
      {refresh_token: refreshToken},
      {
        where: {
          id: adminId,
        },
      }
    );
    res.cookie ('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json ({accessToken});
  } catch (error) {
    console.log (error);
    res.status (404).json ({msg: 'Email atau Password salah'});
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus (204);

  const admin = await AdminModel.findAll ({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!admin[0]) return res.sendStatus (204);

  const adminId = admin[0].id;

  await AdminModel.update (
    {refreshToken: null},
    {
      where: {
        id: adminId,
      },
    }
  );
  res.clearCookie ('refreshToken');
  return res.sendStatus (200);
};
