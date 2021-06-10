const { Sequelize } = require('sequelize')
const UserModel = require('../models/UserModel')

const sequelize = new Sequelize(`postgres://postgres:new_password@localhost:5432/test`, {
    logging: false
})

// ;(async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//       } catch (error) {
//         console.error('Unable to connect to the database:', error);
//       }
// })()


async function postgres () {
    try {
        let db = {}
        
        db.users = await UserModel(Sequelize, sequelize)

        await sequelize.sync({ force: false })

        return db
    } catch (error) {
        console.log(`DB_ERROR:` + error);
    }
}

module.exports = postgres

// User sistema va u uchun ma'lumotlar bazasi shakllanishi kerak.
// Userning ismi, raqami, genderi, bdate va email, email va raqami unique, va emailni verification qilish kerak.