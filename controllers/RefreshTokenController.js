import AdminModel from '../models/AdminModel.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus (401);

    const admin = await AdminModel.findAll ({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!admin[0]) return res.sendStatus (403);

    jwt.verify (
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return res.sendStatus (403);

        const adminId = admin[0].id;
        const name = admin[0].name;
        const email = admin[0].email;

        const accessToken = jwt.sign (
          {adminId, name, email},
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '5s',
          }
        );
        res.json ({accessToken});
      }
    );
  } catch (error) {
    console.log (error);
  }
};
