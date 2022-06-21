const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Articles = require('./Article')
const { default: slugify } = require('slugify')

router.get('/admin/articles', (res, req) => {
    req.render("admin/articles/index")
})

router.get('/admin/articles/new', (res, req) => {
    Category.findAll().then(categories => {
        req.render("admin/articles/new", { categories: categories })
    })

})

router.post("/articles/save", (res, req) => {
    var title = res.body.MyTitle
    var body = res.body.body
    var category = res.body.category
    Articles.create({
        title: title,
        body: body,
        slug: slugify(title),
        categoryId: category
    }).then(() => {
         req.redirect("/admin/articles")
     })
})




module.exports = router