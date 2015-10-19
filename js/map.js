$(function(){
	//var stores = Stores;
	var stores =['Resort Dr, Pasay, Metro Manila, Philippines',
				 '1 Palm Ave, Makati, 1220 Metro Manila, Philippines',
				 '121 Valero, Makati, Kalakhang Maynila, Philippines',
				 '1499 Carissa, Makati, 1221 Metro Manila, Philippines',
				 'EDSA Interchange, Makati, Metro Manila, Philippines',
				 '8 Liwayway, Taguig, 1637 Metro Manila, Philippines',
				 '5 Zamboanga, Quezon City, 1104 Metro Manila, Philippines',
				 '5 Visayas Ave, Diliman, Quezon City, 1128 Metro Manila, Philippines',
				 '105 Gen. Evangelista Street, City of Bacoor, 4102 Cavite, Philippines',
				 'Atlantic Ave, Parañaque, Metro Manila, Philippines',
				 'Cattleya, Muntinlupa, Metro Manila, Philippines',
				 'Luciano, San Roque, Cavite City, Cavite, Philippines',
				 'Unnamed Road, Imus, Cavite, Philippines',
				 '17th St, Parañaque, Metro Manila, Philippines',
				 'Orcullo Street, Kawit, Cavite, Philippines'
	];

	var ICONS = {destination:'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000',
				 origin:'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000'};

	var user_location = 'Ayala Triangle Walkways, Makati, Metro Manila, Philippines';
	var store_markers = {};
	var user_marker, map, geocoder, service;

	function initialize(){
	   var mapOptions = {
  	     zoom: 13,
  	     center: new google.maps.LatLng(14.557260553429545,121.02160334587097),
  	     mapTypeId: google.maps.MapTypeId.ROADMAP
  	   };
  			
	   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	   //geocoder
	   geocoder = new google.maps.Geocoder();
	   service =  new google.maps.DistanceMatrixService();
	   initStoreMarkers();
	   initUserMarker();
	   calculateDistances();
	};

	function geoCode(params, callback){
		geocoder.geocode(params, callback);
	}

	function createMarker(location, address, icon){
		var marker = new google.maps.Marker({
        	map: map,
        	position: location,
        	icon: icon
      	});
      	addInfoWindow(address, marker);
      	return marker;
	}

	function addInfoWindow(message, marker){
		var infowindow = new google.maps.InfoWindow({
    		content: message
  		});
  		marker.addListener('click', function(){
    		infowindow.open(map, marker);
  		});
	}

	function initStoreMarkers(){
		function callback(results, status){
			if (status == google.maps.GeocoderStatus.OK){
				var marker = createMarker(results[0].geometry.location, results[0].formatted_address, ICONS.destination);
				store_markers[results[0].place_id] = marker;
			}else{
				console.log('store location could not be geocoded');
			}
		}

		var index = 0;

		function loop_stores(max){
			while (index < max){
				geoCode({'address': stores[index]}, callback);
				index++;
			}
		}
		
		loop_stores(10);

		setTimeout(function(){
			loop_stores(15);
		}, 5000);

	}

	function initUserMarker(){
		function callback(results, status){
			if (status == google.maps.GeocoderStatus.OK){
				user_marker = createMarker(results[0].geometry.location, results[0].formatted_address, ICONS.origin);
			}else{
				console.log('user location could not be geocoded');
			}
		}
		setTimeout(function(){
			geoCode({'address': user_location}, callback);
		}, 6000);
	}

	function displayNClosestCtore(n){

	}

	function calculateDistances(){
		var unitSys = 'mi';
		if(unitSys == "mi") {
	  		unitSys = google.maps.UnitSystem.IMPERIAL;
	  	} else if(unitSys == "km") {
	  		unitSys = google.maps.UnitSystem.METRIC;
	  	}

	  	function callback(response, status){
	  		if (status == google.maps.DistanceMatrixStatus.OK){
	  			view.renderDistances(response);
	  		}
	  	}

	  	service.getDistanceMatrix(
	  	{
		  origins: [user_location],
		  destinations: stores,
		  travelMode: google.maps.TravelMode.DRIVING,
		  unitSystem: unitSys,
		  avoidHighways: false,
		  avoidTolls: false
	  	},callback);
	}

	var view = {
		renderDistances: function(results){
			$('#directions-panel').append('Origin: ' + results.origin_addresses[0] + '<br>')
				.append('<strong>To :</strong><br>');
			for(var i=0; i<results.destination_addresses.length; i++){
				$('#directions-panel')
					.appen(results.destination_addresses[i] + ' = ' + results.rows.elements[i].distance.text + '<br>');
			}

		}

	};

	google.maps.event.addDomListener(window, 'load', initialize);
});