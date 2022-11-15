const puppeteer = require("puppeteer");
const hbs = require("hbs");
const fs = require("fs");
const path = require("path");

module.exports = {
  async generatePDF({ data: dataBinding }) {
    try {
      const templateHtml = fs.readFileSync(
        path.join(process.cwd(), "./templates/invoice/index.html"),
        "utf8"
      );

      const options = {
        format: "A4",
        displayHeaderFooter: false,
        printBackground: true,
        path: `invoices/invoice-${Date.now()}.pdf`,
      };
      const template = hbs.compile(templateHtml);
      const imgs = {
        logo: fs
          .readFileSync(process.cwd() + "/templates/invoice/logo.png")
          .toString("base64"),
        kiosk: fs
          .readFileSync(process.cwd() + "/templates/invoice/kiosk.png")
          .toString("base64"),
        wallets: fs
          .readFileSync(process.cwd() + "/templates/invoice/wallets.png")
          .toString("base64"),
      };
      const finalHtml = encodeURIComponent(
        template({ ...dataBinding, ...imgs })
      );

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
      if (page) {
        return true;
      }
      return;
    } catch (e) {
      console.log(e);
    }
  },
};
