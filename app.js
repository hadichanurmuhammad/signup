const express = require('express')
const postgres = require('./modules/postgres')
const signupValidation = require('./validations/SignUpValidation')
const phoneValidation = require('./validations/PhoneValidation')
const nodemailer = require('nodemailer')
const randomNumber = require('random-number')


async function main () {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    let db = await postgres()

    app.post('/signup', async (req, res) => {
        try {
            const data = await signupValidation.validateAsync(req.body)
            // console.log(req);

            const user = await db.users.create({
                name: data.name,
                bdate: data.bdate,
                phone: data.phone,
                gender: data.gender == 1 ? "female" : "male",
                email: data.email
            })

            const gen = await randomNumber.generator({
                min:  100000, 
                max:  999999, 
                integer: true
            })
            
            let testAccount = await nodemailer.createTestAccount()
            
            const transport = await nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                }
            })
            
            const info = await transport.sendMail({
                from: `"Someone" ${testAccount.user}`,
                to: `hadichanurmuhammad2006@gmail.com`,
                subject: "Test uchun yuborildi",
                text: `http://localhost:${gen}`
            })

            await res.status(201).json({
                ok: true,
                message: "Successfully registrated",
                data: user.dataValues
            })

        } catch (error) {
            if(error == "SequelizeUniqueConstraintError: Validation error"){
                error = "Phone already exists"
            }
            res.status(400).json({
                ok: false,
                message: error + ""
            })
            console.log(error);
            
        }
    })

    app.post('/login', async (req, res) => {
        try {
            const data = await phoneValidation.validateAsync(req.body)
            const user = await db.users.findOne({
                where: {
                    phone: data.phone
                }
            })

            if(!user) throw new Error('User not found')
            
            await res.status(201).json({
                ok: true,
                message: "Successfully logined"
            })
            
        } catch (error) {
            res.status(401).json({
                ok: false,
                message: error + ""
            })
        }
    })


    app.listen(3000, () => console.log(`SERVER READY`))
}

main()
