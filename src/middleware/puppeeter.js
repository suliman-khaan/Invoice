const puppeteer = require("puppeteer");
const hbs = require("hbs");
const fs = require('fs')

module.exports = {
  async generatePDF({ templateHtml, dataBinding, options }) {
    try {
      const template = hbs.compile(templateHtml);
      const imgs = {
        logo: fs.readFileSync(process.cwd() + '/templates/invoice/logo.png').toString('base64'),
        kiosk: fs.readFileSync(process.cwd() + '/templates/invoice/kiosk.png').toString('base64'),
        wallets: fs.readFileSync(process.cwd() + '/templates/invoice/wallets.png').toString('base64')
      }
      const finalHtml = encodeURIComponent(template({ ...dataBinding, ...imgs }));

      const browser = await puppeteer.launch({
        args: [
          "--allow-file-access-from-files",
          "--enable-local-file-accesses",
        ],
        headless: true,
      });
      const page = await browser.newPage();
      await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
        waitUntil: "networkidle0",
      });
      //   await page.goto(`file://data:text/html;charset=UTF-8,${finalHtml}`, {
      //     waitUntil: "networkidle0",
      //   });
      await page.pdf(options);
      await browser.close();
    } catch (e) {
      console.log(e);
    }
  },
};
