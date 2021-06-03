mapboxgl.accessToken = mapboxToken;
  
const map = new mapboxgl.Map({
  container: 'campgroundIndexMap',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-96.5, 38.5],
  zoom: 3,
  pitchWithRotate: false,
  boxZoom: false,
  dragRotate: false,
  touchPitch: false
});

map.touchZoomRotate.disableRotation();

map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

map.on('load', () => {
  map.addSource('campgrounds', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: campgrounds
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1,
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#43a047',
        10,
        '#388e3c',
        25,
        '#2e7d32',
        40,
        '#1b5e20'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        12,
        10,
        14,
        25,
        16,
        40,
        20
      ]
    }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['Open Sans Bold'],
      'text-size': 14
    },
    paint: {
      'text-color': '#fff'
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#4caf50',
      'circle-radius': 10,
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1
    }
  });
});

map.on('click', 'clusters', (ev) => {
  const features = map.queryRenderedFeatures(ev.point, {
    layers: ['clusters']
  });

  const clusterId = features[0].properties.cluster_id;

  map.getSource('campgrounds').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
      if (err) return;

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    }
  )
});

map.on('mouseenter', 'clusters', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'clusters', () => {
  map.getCanvas().style.cursor = '';
});

map.on('click', 'unclustered-point', (ev) => {
  const coordinates = ev.features[0].geometry.coordinates.slice();
  const props = ev.features[0].properties

  while (Math.abs(ev.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += ev.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(`<p><strong>${props.title}</strong></p>` +
             `<p>${props.location}</p>` +
             `<div class="d-grid"><a class="btn btn-sm btn-primary" href="/campgrounds/${props._id}">View Campground</a></div>`)
    .addTo(map);
});

map.on('mouseenter', 'unclustered-point', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'unclustered-point', () => {
  map.getCanvas().style.cursor = '';
});
