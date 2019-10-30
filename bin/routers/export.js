const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const log = console.log

router.get('/export/:format', (req, res) => {
    log(req.params)

    res.status(200).send(req.params)
})

router.post('/export/:format', (req, res) => {
    const allowedList = ['scss-template', 'json-template', 'c-template'],
          template = ['scss.temp','jsobj.temp','c.temp'],
          format = req.params.format,
          templateNo = allowedList.indexOf(format),
          allowed = templateNo > -1,
          reqStatus = (allowed) ? 200 : 404,
          templateUse = (allowed)? template[templateNo] : false

    var   message = (allowed)
                    ? {file: req.params.format + '.temp'}
                    : {error: 'Template not found'}

    if (allowed) {
        const fs = require('fs')

        var tempText = fs.readFileSync(__dirname + '/../../templates/text/' + templateUse, 'utf8', (err, data) => {
            if (err) throw err
            console.log(typeof data)
            return data;
        })

        message.template = tempText
    }


    res.status(reqStatus).send(message)
})

module.exports = router