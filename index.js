const bodyParser = require('body-parser')
const express = require('express')
const app = express()
//body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const Category = require('./categories/Category')
const Article = require('./articles/Article')

//conect db
const conn = require('./database/database')
//authenticate
conn.authenticate()
    .then(() => {
        console.log('db connected success!!')
    })
    .catch((error) => {
        console.log(error.message)
    })

//view engine
app.set('view engine', 'ejs')

const articlesController = require('./articles/ArticlesController')
const categoriesController = require('./categories/CategoriesController')

app.use('/', articlesController)
app.use('/', categoriesController)


//pasta public
app.use(express.static('public'))

app.get("/", (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']]
    }).then(article => {
        Category.findAll().then(categorias => {
            res.render("index", { articles: article, categorias: categorias })
        })
    }).catch((err) => {
        console.log(err.message)
    })

})

app.get('/:slug', (res, req) => {
    var slug = res.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((article) => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                req.render("article", { article: article, categories: categories })
            })

        } else {
            req.redirect("/")
        }
    }).catch(() => {
        req.redirect("/")
    })
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article, require: true}]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })
            })
        } else {
            res.redirect("/")
        }
    }).catch(() => {
        res.redirect("/")
    })
})
app.listen(8080, () => console.log('Server Conectado! '))