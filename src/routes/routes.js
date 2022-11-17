const express = require("express");
const { generatePDF } = require("../controller/pdf_generator");
const router = new express.Router();
const data = require("../data/data.json");
const fs = require("fs");

router.get("/", (req, res) => {
    res.render("backup", { data });
});
router.get("/generatePDF", async (req, res) => {
    const pdf = await generatePDF({ data });
    if (pdf) {
        console.log("Done: pdf is created!");
        return res.render("backup", {
            data,
            msg: "PDF Generated. Check Invoices folder",
        });
    }
    return res.render("backup", { data, msg: "Sorry failed to generate PDF." });
});

module.exports = router;
