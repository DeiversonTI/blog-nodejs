const express = require('express')
const router = express.Router()

router.get('/articles', (res, req) => {
    req.send("PAGINA DOS ARTIGOS")
})

router.get('/admin/new', (res, req) => {
    req.send("ADMINISTRATIVO DOS ARTIGOS")
})


module.exports = router