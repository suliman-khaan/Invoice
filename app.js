const express = require('express')
const path = require('path')
const hbs = require('hbs')

const app = express()
const port = process.env.port || 1000

const routes = require('./src/routes/routes')

const viewPath = path.join(__dirname, './templates/views')
const publicPath = path.join(__dirname, './public/')
const partialPath = path.join(__dirname, './templates/partials')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'hbs')
app.set('views', viewPath)
app.use(express.static(publicPath))
hbs.registerPartials(partialPath)

app.use(routes)

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})