// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        accessToken: 'pk.eyJ1IjoicGVubG93OTkiLCJhIjoiY2tsZDgzOXNpMDF6YTJ1cXBiaXZ6cDl3bCJ9.BJssP1C-Mp7LCPqEQhmOow'
});

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1IjoicGVubG93OTkiLCJhIjoiY2tsZDgzOXNpMDF6YTJ1cXBiaXZ6cDl3bCJ9.BJssP1C-Mp7LCPqEQhmOow'
    // checking
});

// Create a base layer that holds both maps.
let baseMaps = {
  Dark: dark,
  Street: streets
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
  center: [37.1, -95.7],
  zoom: 4,
  layers: [streets]
})

// Create a style for the lines.
let yesIt = {
  color: "black",
  weight: 1,
  fillColor: "blue"
}
let noIt = {
  color: "black",
  weight: 1,
  fillColor: "red"
}

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Load up the MSA geojson data
let MSAjson = "https://raw.githubusercontent.com/penlow99/Mapping_MSA/main/MSA_geo.geojson"

var counter = 0
var NewList = []

// get values dumped into hidden fields in html
var data_dump = document.getElementById('hidden_data').value
var cbsa_dump = document.getElementById('hidden_cbsa').value
var emergent_dump = document.getElementById('hidden_emergent').value
// separate into arrays
var arrayData = data_dump.split('||');
var arrayCBSA = cbsa_dump.split('||')
var msaYes = emergent_dump.split('||')
console.log(msaYes)
// use two arrays to build dictionary with CBSA as key
dict = {}
for(var i = 0; i < arrayData.length; i++) {
  dict[arrayCBSA[i]] = arrayData[i];
}

// Grabbing our GeoJSON data.
d3.json(MSAjson).then(function(data) {
// Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    filter: function(feature) {
      if (feature.properties.lsad === "M1") return true
    },
    style: function(feature) {
      if (msaYes.includes(feature.properties.cbsafp)) {
        NewList.push(feature.properties.cbsafp)
        return yesIt;
      } else {
        return noIt;
      }
    },
    onEachFeature: function(feature, layer) {
      let cbsa = feature.properties.cbsafp;
      layer.bindPopup(build_html(feature.properties.name, cbsa, dict[cbsa]));
    }
  }).addTo(map);
//console.log(NewList)
});

function build_html(msa_name, cbsa, ranks) {
  var arrRanks = ranks.split('|')
  var html = `
  <h3>MSA:`  + msa_name + `</h3>
  <table>
    <tr>
        <td>CBSA : </td>
        <td>` + cbsa + `</td>
    </tr>
    <tr>
        <td>Population ROC Rank : </td>
        <td>` + arrRanks[0] + `</td>
    </tr>
    <tr>
        <td>Unemployment ROC Rank : </td>
        <td>` + arrRanks[1] + `</td>
    </tr>
    <tr>
        <td>Employment ROC Rank : </td>
        <td>` + arrRanks[2] + `</td>
    </tr>
    <tr>
        <td>GDP ROC Rank : </td>
        <td>` + arrRanks[3] + `</td>
    </tr>
    <tr>
        <td>Rank Total : </td>
        <td>` + arrRanks[4] + `</td>
    </tr>
  </table>
  `
  return html
}
