import { Sequelize } from "sequelize";

const db = new Sequelize('bioskop_kesayangan_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;