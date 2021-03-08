mapboxgl.accessToken = "pk.eyJ1Ijoic3VyZW5kcmFyayIsImEiOiJja20xMm5oYTIwNDVuMnZwaTRmenlkMWVhIn0.IEP9jryaKL3Lxk_MQe4Rbg";
 
/* Map: This represents the map on the page. */
var map = new mapboxgl.Map({
container: "map",
style: "mapbox://styles/mapbox/dark-v10",
zoom: 16,
center: [80.2294,12.9896]

});
 
map.on("load", function () {
/* Image: An image is loaded and added to the map. */
map.loadImage("https://i.imgur.com/MK4NUzI.png", function(error, image) {
if (error) throw error;
map.addImage("custom-marker", image);
/* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
map.addLayer({
id: "markers",
type: "symbol",
/* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
source: {
type: "geojson",
data: {
type: 'FeatureCollection',
features: [
{
type: 'Feature',
properties: {},
geometry: {
type: "Point",
coordinates: [-86.9150504, 40.4301805]
}
}
]
}
},
layout: {
"icon-image": "custom-marker",
}
});
});
});
