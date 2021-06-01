mapboxgl.accessToken = mapboxToken;
  
const map = new mapboxgl.Map({
  container: 'campgroundShowMap',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: coordinates,
  zoom: 8,
  pitchWithRotate: false,
  boxZoom: false,
  dragRotate: false,
  touchZoomRotate: false,
  touchPitch: false
});

map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

const popup = new mapboxgl.Popup()
  .setHTML(popupHtml);

const marker = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(popup)
  .addTo(map);
