const express = require('express')
const showdown = require('showdown')
const fs = require('fs')
const auth = require('../middleware/auth')
const router = new express.Router()

const fetchMds = () => {
    var mdList = [],
        error = false,
        list

    list = fs.readdirSync(__dirname + '/../../')

    for (var i=0; i < list.length; i++) {
        if (list[i].match(/.md$/)) {
            mdList.push(list[i].replace('.md', ''))
        }
    }

    if (list.length === 0) {
        error = 'Unable to fetch help files'
    }

    return {error, list: mdList}
}

const helpList = () => {
    const template = '<li><a href="/help/[filename]">[label]</a></li>'
    const items = fetchMds()

    if(items.error) {
        console.log(items.error)
        return false
    }

    var nav = [],
        filename,
        friendly,
        listitem
        

    for (var i = 0; i < items.list.length; i++) {
        filename = items.list[i]
        friendly = filename.replace(/(\w)([A-Z])/, `$1 $2`).trim()
        listitem = template
            .replace('[filename]', filename)
            .replace('[label]', friendly)
        nav.push(listitem)
    }

    return '<ul>\n' + nav.join('\n') + '\n</ul>'
}

router.get('/help/test', (req, res) => {
    console.log(helpList())

    res.status(200).send()
})

router.get('/help/:page', (req, res) => {
    var converter = new showdown.Converter(),
        params = (req.params !== undefined) ? req.params : false,
        page = (params && params.page !== undefined) ? params.page : 'ReadMe'

    var html = fs.readFileSync(__dirname + '/../../' + page + '.md', 'utf8', (err, data) => {
        if (err) throw err
        console.log(typeof data)
        return data;
    })

    res.render('pages', {
        title: page + '.md',
        author: 'Rafael Vila',
        body: converter.makeHtml(html.replace(/\.\/public/gm,'')),
        sidebar: helpList(),
        md: 1
    })
})

router.get('/help*', (req, res) => {
    var converter = new showdown.Converter();

    res.render('pages', {
        title: 'Help Guide',
        body: converter.makeHtml('#RGB Palette Help\n\nSelect topic from the list of content.'),
        sidebar: helpList(),
        md: 1
    })
})

module.exports = router