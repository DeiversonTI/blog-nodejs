const Sequelize = require('sequelize')

const conn = new Sequelize('blog', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = conn

