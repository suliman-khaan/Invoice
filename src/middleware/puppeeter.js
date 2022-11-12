const puppeteer = require('puppeteer');
const hbs = require('hbs');
const fs = require('fs-extra')
const path = require('path')

const compile = async function (templateName, data) {
    const filePath = path.join(process.cwd(), 'templates/views', `${templateName}.hbs`)

    const html = await fs.readFile(filePath, 'utf8')
    return hbs.compile(html)(data)
};

// (async function () {
//     try {
//         const browser = await puppeteer.launch()
//         const page = await browser.newPage()
//         const content = await compile('backup', { title: "Test" })
//         await page.setContent(content)
//         await page.pdf({
//             path: 'output.pdf',
//             format: 'A4',
//             printBackground: true
//         })

//         console.log("done creating pdf")
//         await browser.close()
//         process.exit()

//     } catch (e) {
//         console.log(e)
//     }
// })()

module.exports = {
    async generatePDF(data) {
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            const content = await compile('backup', data)
            await page.setContent(content)
            const pdf = await page.pdf({
                path: 'output.pdf',
                format: 'A4',
                printBackground: true,
                margin: {
                    left: 1,
                    right: 1
                }
            })

            console.log("done creating pdf")
            await browser.close()
            // process.exit()
            return pdf;
        } catch (e) {
            console.log(e)
        }
    }
}