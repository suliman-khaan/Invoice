const express = require("express");
const path = require("path");
const hbs = require("hbs");

const app = express();
const port = process.env.port || 1000;

const routes = require("./src/routes/routes");

const viewPath = path.join(__dirname, "./templates/views");
const publicPath = path.join(__dirname, "./public/");
const partialPath = path.join(__dirname, "./templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", viewPath);
app.use(express.static(publicPath));
hbs.registerPartials(partialPath);

hbs.registerHelper("equalTo", function (val1, val2, options) {
  if (Math.ceil(val1 / 5) == val2) {
    return options.fn(this);
  }
});
hbs.registerHelper("times", function (from, to, block) {
  var repetition = "";
  for (var i = from; i < to; ++i) {
    block.data.index = i;
    repetition += block.fn(i);
  }
  return repetition;
});
//hbs helper
hbs.registerHelper("dividedBy", function (val1, val2, options) {
  if (val1 % val2 == 0) {
    return options.fn(this);
  }
});

app.use(routes);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
