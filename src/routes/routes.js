const express = require('express')
const { generatePDF } = require('../controller/puppeeter')
const router = new express.Router()

router.get('/', (req, res) => {
    res.render('button')
})

router.get('/generatePDF', async (req, res) => {
    (async () => {
        const dataBinding = {
            items: [
                {
                    name: "item 1",
                    price: 100,
                },
                {
                    name: "item 2",
                    price: 200,
                },
                {
                    name: "item 3",
                    price: 300,
                },
            ],
            total: 600,
            isWatermark: true,
        };

        const pdf = await generatePDF({ dataBinding });
        if(pdf){
            console.log("Done: invoice.pdf is created!");
        }
        res.redirect('/')
    })();
})

module.exports = router