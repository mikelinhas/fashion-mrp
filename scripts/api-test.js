var request = require("request");
require('dotenv').config();
const fs = require('fs');


if (process.env.NODE_ENV === 'development') {
    console.log("Using test API")
    var API = process.env.HOLDED_KEY_TEST
}

if (process.env.NODE_ENV === 'production') {
    console.log("\x1b[33m", "Caution: Using production API", "\x1b[30m")
    var API = process.env.HOLDED_KEY_PROD
}

var options = {
  method: 'GET',
  url: 'https://api.holded.com/api/invoicing/v1/contacts',
  headers: {accept: 'application/json', key: API}
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  let array = JSON.parse(body)
  let suppliers = []
  //fs.writeFile("contacts.json", JSON.stringify(array) , function(err) {
  //    if(err) {
  //        return console.log(err);
  //    }
  //    console.log("The file was saved!");
  //}); 

  //array.forEach(function(contact){
  //	if (contact.type == "supplier") {
  //		console.log(contact.name)
  //	}
  //})

  //array.filter(function(contact){
  //	if (contact.type == "supplier") {
  		//console.log(contact)
  //		return contact
  //	}
  //})
});