import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
// import db from './config/Database.js';
// (async () => {
//   await db.sync();
// })();
dotenv.config();
const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.use(router);

app.listen(5000, () => console.log(`Server is running in port 5000...`));
