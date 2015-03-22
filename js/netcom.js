(function(){ 'use strict';

	var map = L.map('map');

	var simple = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	}).addTo(map);

	var detailed = L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});

	var netcom = L.tileLayer.wms('https://netcom.no/gcp/tile', {
		services: 'GSM_GPRS',
		qualities: '1,2',
		countryid: 'NO_TELIASONERA-CP',
		serviceGroup: 'mobile_broadband_TSNO',
		attribution: 'NetCom'
	}).addTo(map);

	L.control.layers({
		'Enkelt': simple,
		'Detaljert': detailed		
	}, {
		'NetCom': netcom
	}).addTo(map);

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