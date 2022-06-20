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
            title: MyTitle,
            slug: Slugify(MyTitle)
        }).then(() => {
            req.redirect("/")
        })
    } else {
        req.redirect("admin/categories/new")
    }

})

router.get("/admin/categories", (res, req) => {
    Category.findAll().then((resp) => {
        req.render("admin/categories/index", {
            categorias: resp
        })
    })
})

//DELETAR ITEM
router.post('/categories/delete', (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })

        } else {//NÃO FOR UM NUMERO
            res.redirect("/admin/categories")
        }

    } else {// NULL
        res.redirect("/admin/categories")
    }
})

module.exports = router