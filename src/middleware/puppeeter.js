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
    async generatePDF({ templateHtml, dataBinding, options }) {
        try {
            const template = hbs.compile(templateHtml);
            const finalHtml = encodeURIComponent(template(dataBinding));

            const browser = await puppeteer.launch({
                args: ["--no-sandbox"],
                headless: true,
            });
            const page = await browser.newPage();
            await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
                waitUntil: "networkidle0",
            });
            await page.pdf(options);
            await browser.close();
        } catch (e) {
            console.log(e)
        }
    }
}