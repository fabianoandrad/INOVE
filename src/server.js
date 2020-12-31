const express = require('express')
const server = express()
const path = require('path')
const pages = require('./pages')// requisita de /pages.js as functions como se armzenasse o conteudo de pages pra usar aqui em server

server
.use(express.urlencoded({ extended: true }))
.use(express.static('public'))

//configura o template enginer
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'hbs')
//.

.get('/index', pages.index)
.get('/page-list-stock', pages.pageListStock)
.get('/page-sales', pages.pageSales)
.get('/page-sales-delete', pages.pageSalesDelete)
.get('/page-list-stock-delete', pages.pageListStockDelete)
.post('/save-list-stock', pages.saveListStock)
.post('/save-list-sales', pages.saveListSales)

server.listen(3000) 

 