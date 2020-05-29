const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config();

console.log(process.env);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res)=>{
res.sendFile(__dirname+"/index.html");
});

app.post("/", (req,res)=>{
  console.log(req.body.cityName);
  const query = req.body.cityName;
  const appKey = process.env.API_KEY;
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appKey}&units=${unit}`;

  https.get(url, (response) =>{
    console.log(response.statusCode);

    response.on("data", (data)=>{
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write(`<p>The weather is currently ${weatherDescription}</p>`);
      res.write(`<h1>The temp in ${req.body.cityName} is ${temp} degree celcius</h1>`);
      res.write(`<img src="${iconUrl}">`);
      res.send();
    });
  });

});

app.listen(3000,()=> {
  console.log("port 3000 activated");
});
