const puppeteer = require("puppeteer");
const hbs = require("hbs");
const fs = require("fs-extra");
const path = require("path");

const compile = async function (templateName, data) {
  const filePath = path.join(
    process.cwd(),
    "templates/views",
    `${templateName}.hbs`
  );

  const html = await fs.readFile(filePath, "utf8");
  return hbs.compile(html)(data);
};

module.exports = {
  async generatePDF({ templateHtml, dataBinding, options }) {
    try {
      const template = hbs.compile(templateHtml);
      const finalHtml = encodeURIComponent(template(dataBinding));

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
