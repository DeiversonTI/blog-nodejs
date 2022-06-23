const express = require('express')
const app = express()
const session = require('express-session')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

//Session
app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 30000 }
}))


router.get("/admin/users", (req, res) => {
    User.findAll({ order: [['id', 'DESC']] }).then(users => {
        res.render("admin/users/index", { users: users })
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (res, req) => {
    var email = res.body.email
    var password = res.body.password

    User.findOne({
        where: { email: email }
    }).then((user) => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                password: hash
            }).then(() => {
                req.redirect("/admin/users")
            }).catch(() => {
                req.redirect("/")
            })
        } else {
            req.redirect("/admin/users/create")
        }
    })
})

router.get("/login", (res, req) => {
    req.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email: email }}).then(usuarios => {
            if (usuarios != undefined) {//se existe um usuario com esse e-mail
                //valida senha
                var correct = bcrypt.compareSync(password, usuarios.password)

                if (correct) {
                    req.session.user = {
                        id: usuarios.id,
                        email: usuarios.email
                    }
                    res.redirect("/admin/articles")
                    
                } else {
                    res.redirect("/login")
                }
            } else {
                res.redirect("/login")
            }
        }).catch(err => {
            console.log(err.message)
        })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router