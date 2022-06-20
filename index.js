const bodyParser = require('body-parser')
const express = require('express')
const app = express()
//body parser
app.use(bodyParser.urlencoded({extended: false}))
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
    res.render("index")
})

app.listen(8080, () => console.log('Server Conectado! '))