const puppeteer = require("puppeteer");
const hbs = require("hbs");
const fs = require("fs");
const path = require("path");

//hbs helper
hbs.registerHelper("equalTo", function (val1, val2, options) {
  if (Math.ceil(val1 / 5) == val2) {
    return options.fn(this);
  }
});

// hbs helper
hbs.registerHelper("times", function (from, to, block) {
  var repetition = "";
  for (var i = from; i < to; ++i) {
    block.data.index = i;
    repetition += block.fn(i);
  }
  return repetition;
});

module.exports = {
  async generatePDF({ data: dataBinding }) {
    try {
      // read invoice html template
      const templateHtml = fs.readFileSync(
        path.join(process.cwd(), "./templates/invoice/index.html"),
        "utf8"
      );

      // option for the pdf generator
      // page size i.e A3,A4,A5,A6, LEGAL
      // path with extension(.pdf) where the pdf will save
      const options = {
        format: "A4",
        displayHeaderFooter: false,
        printBackground: true,
        // path: `invoices/invoice-${Date.now()}.pdf`,
        path: `invoices/invoice.pdf`,
      };

      //compile template
      const template = hbs.compile(templateHtml);

      //images to base64
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
        watermark: fs
          .readFileSync(process.cwd() + "/templates/invoice/watermark.png")
          .toString("base64"),
      };

      //encode the data + images
      const finalHtml = encodeURIComponent(
        template({ ...dataBinding, ...imgs })
      );

      // launch a browser instance with given arguments
      const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: true,
      });

      // create a new page in the browser context.
      const page = await browser.newPage();

      // scraping the invoice template
      await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
        waitUntil: "networkidle0",
      });

      //generating pdf
      await page.pdf(options);

      //close the browser instance
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
