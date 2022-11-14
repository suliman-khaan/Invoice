const express = require('express')
const { generatePDF } = require('../middleware/puppeeter')
const router = new express.Router()
const fs = require("fs");
const path = require("path");

router.get('/', (req, res) => {
    res.render('backup')
})
router.get('/pdf', (req, res) => {
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

        const templateHtml = fs.readFileSync(
            path.join(process.cwd(), "./templates/views/index.html"),
            "utf8"
        );

        const options = {
            format: "A4",
            headerTemplate: "<p>Header</p>",
            footerTemplate: "<p>Footer</p>",
            displayHeaderFooter: false,
            margin: 0,
            printBackground: true,
            path: "invoice.pdf",
        };

        await generatePDF({ templateHtml, dataBinding, options });

        console.log("Done: invoice.pdf is created!");
        res.redirect('/pdf')
    })();
})

module.exports = router