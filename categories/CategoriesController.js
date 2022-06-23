const express = require('express')
const router = express.Router()
const Category = require('./Category')
const Slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')


router.get('/admin/categories/new', adminAuth, (res, req) => {
    req.render("admin/categories/new")
})

router.post('/categories/save', adminAuth, (res, req) => {
    var MyTitle = res.body.MyTitle
    if (MyTitle != undefined) {
        Category.create({
            title: MyTitle,
            slug: Slugify(MyTitle)
        }).then(() => {
            req.render("admin/categories/new")
        })
    } else {
        req.redirect("admin/categories")
    }

})

router.get("/admin/categories", adminAuth, (res, req) => {
    Category.findAll({
        order: [['id', 'DESC']]
    }).then((resp) => {
        req.render("admin/categories/index", {
            categorias: resp
        })
    })
})

//DELETAR ITEM
router.post('/categories/delete', adminAuth, (req, res) => {
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

router.get('/admin/categories/edit/:id', adminAuth, (res, req) => {
    var id = res.params.id
    if (isNaN(id)) {
        req.redirect("/admin/categories")
    }
    Category.findByPk(id).then(category => {
        if (category != undefined) {
            req.render("admin/categories/edit", {category: category})
        } else {
            req.render("/admin/categories")
        }
    }).catch(() => {
        req.render("/admin/categories")
    })
})

router.post('/categories/update', adminAuth, (req, res) => {
    var id = req.body.id
    var title = req.body.MyTitle
    Category.update({ title: title, slug: Slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router