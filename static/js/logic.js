// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
  Satellite: satelliteStreets,
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

// Accessing the Toronto neighborhoods GeoJSON URL.
// let torontoHoods = "https://raw.githubusercontent.com/penlow99/Mapping_Earthquakes/main/torontoNeighborhoods.json";

// Load up the MSA geojson data
let MSAjson = "MSA_geo.geojson"
// Use the MSA list to 
let msaYes = ['10540', '12020', '12060', '12220', '12420', '13380', '13460', '13900', '14260', '14500', '14540', '15500', '15980', '16700', '16740', '17300', '17660', '17780', '17820', '18140', '18880', '19100', '19300', '19660', '19740', '19780', '20100', '20500', '22020', '22220', '22660', '23580', '24540', '24860', '25220', '25940', '26420', '26620', '26820', '26980', '27260', '27860', '28420', '28660', '29200', '29460', '29700', '29820', '30700', '30860', '31180', '32580', '33100', '33260', '34580', '34820', '34940', '34980', '35840', '36100', '36220', '36260', '36420', '36500', '36740', '37340', '37860', '38060', '38900', '38940', '39150', '39340', '39460', '39580', '39660', '39900', '41100', '41420', '41540', '41620', '41700', '42340', '42660', '42680', '43300', '43620', '43900', '44060', '44700', '45300', '45540', '46300', '46340', '47580', '47900', '48900']
var counter = 0
var NewList = []
// Grabbing our GeoJSON data.
d3.json(MSAjson).then(function(data) {
  //console.log(data);
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
      layer.bindPopup("<h3>MSA: " + feature.properties.name + "</h3><h4>" + feature.properties.cbsafp + "</h4>");
    }
  }).addTo(map);
console.log(NewList)
});
