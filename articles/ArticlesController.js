const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Articles = require('./Article')
const Slugify = require('slugify')

router.get('/admin/articles', (res, req) => {
    Articles.findAll({
        // include: [ { model: Category} ]
    }).then(articles => {
        req.render("admin/articles/index", {articles: articles})
    })
    
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
        slug: Slugify(slug),
        categoryId: category
    }).then(() => {
         req.redirect("/admin/articles")
     })
})

//DELETAR ITEM
router.post('/articles/delete', (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)){

            Articles.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })

        } else {//NÃO FOR UM NUMERO
            res.redirect("/admin/articles")
        }

    } else {// NULL
        res.redirect("/admin/articles")
    }
})




module.exports = router