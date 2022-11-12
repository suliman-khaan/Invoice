const express = require('express')
const { generatePDF } = require('../middleware/puppeeter')
const router = new express.Router()

router.get('/', (req, res) => {
    res.render('backup')
})
router.get('/pdf', (req, res) => {
    res.render('button')
})
router.get('/generatePDF', async (req, res) => {
    await generatePDF({ title: "Welcome" })
    res.redirect('/pdf')
})

module.exports = router