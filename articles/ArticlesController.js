const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Articles = require('./Article')
const Slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')


router.get('/admin/articles', adminAuth, (res, req) => {
    Articles.findAll({
        include: [{ model: Category, required: true }],
        order: [['id', 'DESC']]
    }).then(artigosAdmin => {

        req.render("admin/articles/index", { resp: artigosAdmin })


    })

})

router.get('/admin/articles/new', adminAuth, (res, req) => {
    Category.findAll().then(categories => {
        req.render("admin/articles/new", { categories: categories })
    })

})

router.post("/articles/save", adminAuth, (res, req) => {
    var title = res.body.title
    var body = res.body.body
    var category = res.body.category
    Articles.create({
        title: title,
        body: body,
        slug: Slugify(title),
        categoryId: category
    }).then(() => {
        req.redirect("/admin/articles")
    }).catch((err) => {
        console.log(err.message)
    })
})

//DELETAR ITEM
router.post('/articles/delete', adminAuth, (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {

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

router.get('/admin/articles/edit/:id', adminAuth, (res, req) => {
    var id = res.params.id
    Articles.findByPk(id)
        .then((article) => {
            if (article != undefined) {
                Category.findAll().then(categories => {
                    req.render("admin/articles/edit", { categories: categories, article: article })
                })

            } else {
                req.redirect("/")
            }
        }).catch(() => {
            req.redirect("/")
        })
})

router.post('/articles/update', adminAuth, (res, req) => {
    var id = res.body.id
    var title = res.body.title
    var body = res.body.body
    var category = res.body.category

    Articles.update({ title: title, body: body, categoryId: category, slug: Slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        req.redirect("/admin/articles")
    }).catch((err) => {
        console.log('ERROR DO EDITAR ==> ', err.message)
        // req.redirect("/")
    })
})

router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = parseInt((page)-1) * 4
    }

    Articles.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]
    }).then((articles) => {

        var next
        if (offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles:  articles
        }

        Category.findAll().then((categories) => {
            res.render("admin/articles/page", {
                result: result, categories: categories
            })
        })

    })
})




module.exports = router