require('dotenv').config();

var request = require('request');
var dash_button = require('node-dash-button');
var request = require('request');

var dash = dash_button([process.env.BAD_BUTTON, process.env.GOOD_BUTTON], null, null, 'all'); //address from step above

var postPoint = function(metric) {
  var bothanURL = process.env.BOTHAN_URL
  var metricURL = bothanURL + '/metrics/' + metric + '.json'
  var date = new Date()

  request(metricURL, function(error, response, body) {
    json = JSON.parse(body)
    value = (json == null) ? 0 : json.value

    request.post(metricURL, {
      auth: {
        user: process.env.BOTHAN_USERNAME,
        pass: process.env.BOTHAN_PASSWORD
      },
      json: {
        time: date.toISOString(),
        value: value + 1
      }
    })
  })
}

dash.on("detected", function (dash_id){
  if (dash_id === process.env.BAD_BUTTON){
    console.log("Naughty!")
    postPoint('home-behaviour-points')
  } else if (dash_id === process.env.GOOD_BUTTON){
    console.log("Good!");
    postPoint('home-acheivement-points')
  }
});
