const path = require('path')
const express = require('express')
const hsb = require('hsb')

const app = new express()
const port = process.env.PORT || 3000

//defining path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

//set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hsb.registerPartials(partialPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('/', (req, res) => {
    res.render('index', {
        title: 'Basic RGB Palette Generator',
        name: 'Rafael Vila'
    })
})

app.listen(3000);