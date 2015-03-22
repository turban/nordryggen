(function(){ 'use strict';

	var d = new Date(),
		date = d.getDate(),
		month = d.getMonth() + 1,
		time = d.getFullYear() + '-' + ('0' + month).slice(-2) + '-' + ('0' + date).slice(-2),
		overlays = {};

	var map = L.map('map', {
		crs: L.CRS.EPSG32633,
 		continuousWorld: true,
		worldCopyJump: false		
	});

	var simple = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?REQUEST=GetTile&VERSION=1.0.0&LAYER=norges_grunnkart&TILEMATRIXSET=EPSG%3A32633&TILEMATRIX=EPSG%3A32633%3A{z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng', {
		attribution: 'Kartverket'
	}).addTo(map);

	var detailed = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?REQUEST=GetTile&VERSION=1.0.0&LAYER=topo2&TILEMATRIXSET=EPSG%3A32633&TILEMATRIX=EPSG%3A32633%3A{z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng', {
		attribution: 'Kartverket'
	});

	var snow = L.tileLayer.wms('http://arcus.nve.no/WMS_server/wms_server.aspx', {
		layers: 'sd',
		time: time,
		format: 'image/png',
		transparent: true,
		attribution: 'NVE',
		opacity: 0.9
	}).addTo(map);

	overlays['Snødybde ' + date + '/' + month] = snow

	L.control.layers({
		'Enkelt': simple,
		'Detaljert': detailed		
	}, overlays).addTo(map);

	$.getJSON('data/route.geojson', function(data) {
		var route = L.geoJson(data, {
			style: {
				color: '#000',
				weight: 2 
			}
		}).addTo(map);

		map.fitBounds(route.getBounds());

		$.getJSON('data/cabins.geojson', function(data) {
			L.geoJson(data, {
				pointToLayer: function(cabin, latlng) {
					return L.circleMarker(latlng, {
						radius: 2,
						color: '#000',
						fillOpacity: 1,
						stroke: 'none'
					}).bindPopup(cabin.properties.name);
				}
			}).addTo(map);
		});
	});




})();