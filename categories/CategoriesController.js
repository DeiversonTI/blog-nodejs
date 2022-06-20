const express = require('express')
const router = express.Router()
const Category = require('./Category')
const Slugify = require('slugify')

router.get('/admin/categories/new', (res, req) => {
    req.render("admin/categories/new")
})

router.post('/categories/save', (res, req) => {
    var MyTitle = res.body.MyTitle
    if (MyTitle != undefined) {
         Category.create({
            title:  MyTitle,
            slug: Slugify(MyTitle)
        }).then(() => {
            req.redirect("/")
        })
    } else {
        req.redirect("admin/categories/new")
    }
       
})


module.exports = router