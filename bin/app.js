const express = require('express')
const path = require('path')
const hsb = require('hbs')

//loading routers
const helpRouter = require('./routers/help')
const exportRouter = require('./routers/export')

const app = new express()
const port = process.env.PORT || 3000

//defining path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

//Using routers
app.use(express.json())
app.use(helpRouter)
app.use(exportRouter)

//set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hsb.registerPartials(partialPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('home', {
        title: 'Basic RGB Palette Generator',
        author: 'Rafael Vila'
    })
})

app.listen(port, () => {
    console.log('Server is up in port ' + port)
})