let map2;
let flights = [];

function initMap() {
    return new Promise((resolve) => {
        map2 = new mapboxgl.Map({
            accessToken: 'pk.eyJ1Ijoic3VyZW5kcmFyayIsImEiOiJja20xMm5oYTIwNDVuMnZwaTRmenlkMWVhIn0.IEP9jryaKL3Lxk_MQe4Rbg',
            container: 'map2',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 40],
            zoom: 1,
        });

        map2.on('load', () => {
            map2.resize();
            resolve();
        });
    });
}

function loadFlights() {
    fetch('assets/files/flights.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === '') {
                throw new Error('The flights.csv file is empty');
            }
            const rows = data.trim().split('\n').slice(1);

            flights = rows.map(row => {
                const [
                cabin_class, seat, airline_code, airline, flight_number,
                aircraft, aircraft_type, dep_airport, dep_airport_name,
                arr_airport, arr_airport_name, month, year, time_in_air,
                dep_country, arr_country, aircraft_family, airline_family
            ] = row.split(',');
            return {
                cabin_class, seat, airline_code, airline, flight_number,
                aircraft, aircraft_type, dep_airport, dep_airport_name,
                arr_airport, arr_airport_name, month, year, time_in_air,
                dep_country, arr_country, aircraft_family, airline_family
            };
            });
            updateMap();
            updateStats(flights, 'all');
            updateYearFilter();
        })
        .catch(error => {
            console.error('Error loading flights:', error);
            alert(`Error loading flights: ${error.message}. Please check the console for more details.`);
        });
}

function toggleDetails(selected) {
    const details = document.querySelectorAll('.stat-details');
    
    // Loop through all details sections
    details.forEach(detail => {
        if (detail.id === selected + 'Details') {
            // Toggle the clicked section (show/hide)
            if (detail.classList.contains('show')) {
                detail.classList.remove('show');
            } else {
                detail.classList.add('show');
            }
        } else {
            // Hide all other sections
            detail.classList.remove('show');
        }
    });
}


function updateMap() {
    let timeinair = 0;
    const yearFilter = document.getElementById('yearFilter').value;
    const monthFilter = document.getElementById('monthFilter').value;

    const filteredFlights = flights.filter(flight => {
        return (yearFilter === 'all' || flight.year === yearFilter) &&
            (monthFilter === 'all' || flight.month === monthFilter);
    });
    updateStats(filteredFlights, monthFilter);

    // Example airport coordinates. Replace these with your actual airport data.
    const airportCoordinates = {
        'MAA': [80.1692, 12.9941],  // Chennai International Airport
        'DXB': [55.3644, 25.2528],  // Dubai International Airport
        'HYD': [78.4294, 17.2403],  // Rajiv Gandhi International Airport, Hyderabad
        'CDP': [78.776, 14.5105],   // Cuddapah Airport
        'IDR': [75.8069, 22.7218],  // Devi Ahilya Bai Holkar Airport, Indore
        'MAD': [-3.5695, 40.4722],  // Adolfo Suárez Madrid–Barajas Airport
        'IND': [-86.2944, 39.7173], // Indianapolis International Airport
        'PHX': [-112.0116, 33.4342],// Phoenix Sky Harbor International Airport
        'CDG': [2.55, 49.0097],     // Charles de Gaulle Airport, Paris
        'MUC': [11.7861, 48.3538],  // Munich Airport
        'BBI': [85.8185, 20.2444],  // Biju Patnaik International Airport, Bhubaneswar
        'MSP': [-93.2218, 44.8848], // Minneapolis–Saint Paul International Airport
        'FKB': [8.0805, 48.7793],   // Karlsruhe/Baden-Baden Airport
        'ORD': [-87.9048, 41.9742], // O'Hare International Airport, Chicago
        'DSM': [-93.648, 41.5339],  // Des Moines International Airport
        'STL': [-90.379, 38.7487],  // St. Louis Lambert International Airport
        'HKG': [113.9185, 22.308],  // Hong Kong International Airport
        'DED': [78.179, 30.1897],   // Jolly Grant Airport, Dehradun
        'DEL': [77.1031, 28.5562],  // Indira Gandhi International Airport, Delhi
        'BLR': [77.7102, 13.1979],  // Kempegowda International Airport, Bengaluru
        'BOM': [72.868, 19.0896],   // Chhatrapati Shivaji Maharaj International Airport, Mumbai
        'CMB': [79.8842, 7.1808],   // Bandaranaike International Airport, Colombo
        'KUL': [101.7099, 2.7456],  // Kuala Lumpur International Airport
        'DOH': [51.5651, 25.2731],  // Hamad International Airport, Doha
        'EWR': [-74.1745, 40.6895], // Newark Liberty International Airport
        'FRA': [8.5705, 50.0379],   // Frankfurt Airport
        'DRS': [13.7681, 51.1328],  // Dresden Airport
        'MEL': [144.843, -37.6733], // Melbourne Airport
        'LAS': [-115.1523, 36.084], // Harry Reid International Airport, Las Vegas
        'ANC': [-149.9962, 61.1743],// Ted Stevens Anchorage International Airport
        'ATL': [-84.4277, 33.6407], // Hartsfield–Jackson Atlanta International Airport
        'BER': [13.5033, 52.3667],  // Berlin Brandenburg Airport
        'DCA': [-77.0377, 38.8512], // Ronald Reagan Washington National Airport
        'BNA': [-86.6782, 36.1263], // Nashville International Airport
        'BIO': [-2.9106, 43.3011],  // Bilbao Airport
        'GAU': [91.5803, 26.1061],  // Lokpriya Gopinath Bordoloi International Airport, Guwahati
        'IXL': [77.5453, 34.1359],  // Kushok Bakula Rimpochee Airport, Leh
        'SEA': [-122.3088, 47.4502],// Seattle–Tacoma International Airport
        'MCI': [-94.7139, 39.2976], // Kansas City International Airport
        'LGA': [-73.8726, 40.7769], // LaGuardia Airport, New York
        'ZAD': [15.3467, 44.1083],  // Zadar Airport
        'OSL': [11.1004, 60.1976],  // Oslo Gardermoen Airport
        'DAL': [-96.8518, 32.8471], // Dallas Love Field
        'TOS': [18.9189, 69.6833],  // Tromsø Airport
        'SFO': [-122.375, 37.6188], // San Francisco International Airport
        'JFK': [-73.7781, 40.6413], // John F. Kennedy International Airport, New York
        'TIR': [79.5432, 13.6325],  // Tirupati Airport
        'DFW': [-97.038, 32.8998],  // Dallas/Fort Worth International Airport
        'PRG': [14.2667, 50.1008],  // Václav Havel Airport, Prague
        'DUS': [6.7668, 51.2895],   // Düsseldorf Airport
        'MDW': [-87.7524, 41.7868], // Chicago Midway International Airport
        'STR': [9.221, 48.6899],     // Stuttgart Airport
        'BNE': [153.117, -27.3842], // Brisbane Airport
        'SYD': [151.177, -33.9399], // Sydney Kingsford Smith Airport
        'CNS': [145.754, -16.8858], // Cairns Airport
        'CCU': [88.4467, 22.654],   // Netaji Subhas Chandra Bose International Airport, Kolkata
        'AUS': [-97.6699, 30.2024], // Austin-Bergstrom International Airport
    };
    // Initialize total distance
    let totalDistance = 0;

    if (map2.getSource('routes')) {
        map2.removeLayer('routes');
        map2.removeSource('routes');
    }

    const features = filteredFlights.map(flight => {
        const depCoords = airportCoordinates[flight.dep_airport];
        const arrCoords = airportCoordinates[flight.arr_airport];

        if (!depCoords || !arrCoords) {
            console.warn(`Missing coordinates for flight: ${flight.flight_number}`);
            return null;
        }

        // Calculate the great circle line between two points
        const line = turf.greatCircle(turf.point(depCoords), turf.point(arrCoords));

        // Calculate the distance between departure and arrival in kilometers
        const distance = turf.distance(turf.point(depCoords), turf.point(arrCoords), { units: 'kilometers' });

        // Add the distance to the total distance
        totalDistance += distance;

        // Add the time in air to the total time
        timeinair += parseInt(flight.time_in_air);

        return {
            type: 'Feature',
            geometry: line.geometry,
            properties: {
                flightNumber: flight.flight_number,
                airline: flight.airline,
                aircraft: flight.aircraft
            }
        };
    }).filter(f => f !== null); // Filter out flights with missing coordinates

    map2.addSource('routes', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: features
        }
    });

    map2.addLayer({
        id: 'routes',
        type: 'line',
        source: 'routes',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            // dark brown
            'line-color': '#8B4513',
            'line-width': 2
        }
    });
    // Update the total distance in the HTML
    const formattedDistance = new Intl.NumberFormat('en-US').format(totalDistance.toFixed(0));
    document.getElementById('totalDistance').innerText = `${formattedDistance} km`;

    // Update the HTML
    document.getElementById('totalDistance').innerText = `${formattedDistance} km`;
    document.getElementById('totalTime').innerText = `${timeinair} hours`;
}

const countryFlags = {
    'Afghanistan': '🇦🇫', 'Albania': '🇦🇱', 'Algeria': '🇩🇿', 'Andorra': '🇦🇩', 'Angola': '🇦🇴',
    'Antigua and Barbuda': '🇦🇬', 'Argentina': '🇦🇷', 'Armenia': '🇦🇲', 'Australia': '🇦🇺', 'Austria': '🇦🇹',
    'Azerbaijan': '🇦🇿', 'Bahamas': '🇧🇸', 'Bahrain': '🇧🇭', 'Bangladesh': '🇧🇩', 'Barbados': '🇧🇧',
    'Belarus': '🇧🇾', 'Belgium': '🇧🇪', 'Belize': '🇧🇿', 'Benin': '🇧🇯', 'Bhutan': '🇧🇹',
    'Bolivia': '🇧🇴', 'Bosnia and Herzegovina': '🇧🇦', 'Botswana': '🇧🇼', 'Brazil': '🇧🇷', 'Brunei': '🇧🇳',
    'Bulgaria': '🇧🇬', 'Burkina Faso': '🇧🇫', 'Burundi': '🇧🇮', 'Cabo Verde': '🇨🇻', 'Cambodia': '🇰🇭',
    'Cameroon': '🇨🇲', 'Canada': '🇨🇦', 'Central African Republic': '🇨🇫', 'Chad': '🇹🇩', 'Chile': '🇨🇱',
    'China': '🇨🇳', 'Colombia': '🇨🇴', 'Comoros': '🇰🇲', 'Congo (Congo-Brazzaville)': '🇨🇬', 'Congo (Democratic Republic)': '🇨🇩',
    'Costa Rica': '🇨🇷', 'Croatia': '🇭🇷', 'Cuba': '🇨🇺', 'Cyprus': '🇨🇾', 'Czechia': '🇨🇿',
    'Denmark': '🇩🇰', 'Djibouti': '🇩🇯', 'Dominica': '🇩🇲', 'Dominican Republic': '🇩🇴', 'Ecuador': '🇪🇨',
    'Egypt': '🇪🇬', 'El Salvador': '🇸🇻', 'Equatorial Guinea': '🇬🇶', 'Eritrea': '🇪🇷', 'Estonia': '🇪🇪',
    'Eswatini': '🇸🇿', 'Ethiopia': '🇪🇹', 'Fiji': '🇫🇯', 'Finland': '🇫🇮', 'France': '🇫🇷',
    'Gabon': '🇬🇦', 'Gambia': '🇬🇲', 'Georgia': '🇬🇪', 'Germany': '🇩🇪', 'Ghana': '🇬🇭',
    'Greece': '🇬🇷', 'Grenada': '🇬🇩', 'Guatemala': '🇬🇹', 'Guinea': '🇬🇳', 'Guinea-Bissau': '🇬🇼',
    'Guyana': '🇬🇾', 'Haiti': '🇭🇹', 'Honduras': '🇭🇳', 'Hungary': '🇭🇺', 'Iceland': '🇮🇸',
    'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷', 'Iraq': '🇮🇶', 'Ireland': '🇮🇪',
    'Israel': '🇮🇱', 'Italy': '🇮🇹', 'Jamaica': '🇯🇲', 'Japan': '🇯🇵', 'Jordan': '🇯🇴',
    'Kazakhstan': '🇰🇿', 'Kenya': '🇰🇪', 'Kiribati': '🇰🇮', 'Korea (North)': '🇰🇵', 'Korea (South)': '🇰🇷',
    'Kuwait': '🇰🇼', 'Kyrgyzstan': '🇰🇬', 'Laos': '🇱🇦', 'Latvia': '🇱🇻', 'Lebanon': '🇱🇧',
    'Lesotho': '🇱🇸', 'Liberia': '🇱🇷', 'Libya': '🇱🇾', 'Liechtenstein': '🇱🇮', 'Lithuania': '🇱🇹',
    'Luxembourg': '🇱🇺', 'Madagascar': '🇲🇬', 'Malawi': '🇲🇼', 'Malaysia': '🇲🇾', 'Maldives': '🇲🇻',
    'Mali': '🇲🇱', 'Malta': '🇲🇹', 'Marshall Islands': '🇲🇭', 'Mauritania': '🇲🇷', 'Mauritius': '🇲🇺',
    'Mexico': '🇲🇽', 'Micronesia': '🇫🇲', 'Moldova': '🇲🇩', 'Monaco': '🇲🇨', 'Mongolia': '🇲🇳',
    'Montenegro': '🇲🇪', 'Morocco': '🇲🇦', 'Mozambique': '🇲🇿', 'Myanmar': '🇲🇲', 'Namibia': '🇳🇦',
    'Nauru': '🇳🇷', 'Nepal': '🇳🇵', 'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿', 'Nicaragua': '🇳🇮',
    'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'North Macedonia': '🇲🇰', 'Norway': '🇳🇴', 'Oman': '🇴🇲',
    'Pakistan': '🇵🇰', 'Palau': '🇵🇼', 'Panama': '🇵🇦', 'Papua New Guinea': '🇵🇬', 'Paraguay': '🇵🇾',
    'Peru': '🇵🇪', 'Philippines': '🇵🇭', 'Poland': '🇵🇱', 'Portugal': '🇵🇹', 'Qatar': '🇶🇦',
    'Romania': '🇷🇴', 'Russia': '🇷🇺', 'Rwanda': '🇷🇼', 'Saint Kitts and Nevis': '🇰🇳', 'Saint Lucia': '🇱🇨',
    'Saint Vincent and the Grenadines': '🇻🇨', 'Samoa': '🇼🇸', 'San Marino': '🇸🇲', 'Sao Tome and Principe': '🇸🇹', 'Saudi Arabia': '🇸🇦',
    'Senegal': '🇸🇳', 'Serbia': '🇷🇸', 'Seychelles': '🇸🇨', 'Sierra Leone': '🇸🇱', 'Singapore': '🇸🇬',
    'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Solomon Islands': '🇸🇧', 'Somalia': '🇸🇴', 'South Africa': '🇿🇦',
    'South Sudan': '🇸🇸', 'Spain': '🇪🇸', 'Sri Lanka': '🇱🇰', 'Sudan': '🇸🇩', 'Suriname': '🇸🇷',
    'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'Syria': '🇸🇾', 'Taiwan': '🇹🇼', 'Tajikistan': '🇹🇯',
    'Tanzania': '🇹🇿', 'Thailand': '🇹🇭', 'Timor-Leste': '🇹🇱', 'Togo': '🇹🇬', 'Tonga': '🇹🇴',
    'Trinidad and Tobago': '🇹🇹', 'Tunisia': '🇹🇳', 'Turkey': '🇹🇷', 'Turkmenistan': '🇹🇲', 'Tuvalu': '🇹🇻',
    'Uganda': '🇺🇬', 'Ukraine': '🇺🇦', 'United Arab Emirates': '🇦🇪', 'United Kingdom': '🇬🇧', 'United States': '🇺🇸',
    'Uruguay': '🇺🇾', 'Uzbekistan': '🇺🇿', 'Vanuatu': '🇻🇺', 'Vatican City': '🇻🇦', 'Venezuela': '🇻🇪',
    'Vietnam': '🇻🇳', 'Yemen': '🇾🇪', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼','Hong Kong': '🇭🇰', 'Macau': '🇲🇴', 'Taiwan': '🇹🇼', 'Kosovo': '🇽🇰',
    'Northern Cyprus': '🇹🇷', 'Western Sahara': '🇪🇭', 'Somaliland': '🇸🇴', 'Transnistria': '🇹🇩', 'Nagorno-Karabakh': '🇦🇲', 'Cook Islands': '🇨🇰', 
    'Niue': '🇳🇺', 'Tokelau': '🇹🇰', 'Sahrawi Arab Democratic Republic': '🇪🇭'
    };
    


const continents = {
    'Afghanistan': 'Asia', 'Albania': 'Europe', 'Algeria': 'Africa', 'Andorra': 'Europe', 'Angola': 'Africa',
    'Antigua and Barbuda': 'North America', 'Argentina': 'South America', 'Armenia': 'Asia', 'Australia': 'Australia', 'Austria': 'Europe',
    'Azerbaijan': 'Asia', 'Bahamas': 'North America', 'Bahrain': 'Asia', 'Bangladesh': 'Asia', 'Barbados': 'North America',
    'Belarus': 'Europe', 'Belgium': 'Europe', 'Belize': 'North America', 'Benin': 'Africa', 'Bhutan': 'Asia',
    'Bolivia': 'South America', 'Bosnia and Herzegovina': 'Europe', 'Botswana': 'Africa', 'Brazil': 'South America', 'Brunei': 'Asia',
    'Bulgaria': 'Europe', 'Burkina Faso': 'Africa', 'Burundi': 'Africa', 'Cabo Verde': 'Africa', 'Cambodia': 'Asia',
    'Cameroon': 'Africa', 'Canada': 'North America', 'Central African Republic': 'Africa', 'Chad': 'Africa', 'Chile': 'South America',
    'China': 'Asia', 'Colombia': 'South America', 'Comoros': 'Africa', 'Congo (Congo-Brazzaville)': 'Africa', 'Congo (Democratic Republic)': 'Africa',
    'Costa Rica': 'North America', 'Croatia': 'Europe', 'Cuba': 'North America', 'Cyprus': 'Asia', 'Czechia': 'Europe',
    'Denmark': 'Europe', 'Djibouti': 'Africa', 'Dominica': 'North America', 'Dominican Republic': 'North America', 'Ecuador': 'South America',
    'Egypt': 'Africa', 'El Salvador': 'North America', 'Equatorial Guinea': 'Africa', 'Eritrea': 'Africa', 'Estonia': 'Europe',
    'Eswatini': 'Africa', 'Ethiopia': 'Africa', 'Fiji': 'Oceania', 'Finland': 'Europe', 'France': 'Europe',
    'Gabon': 'Africa', 'Gambia': 'Africa', 'Georgia': 'Asia', 'Germany': 'Europe', 'Ghana': 'Africa',
    'Greece': 'Europe', 'Grenada': 'North America', 'Guatemala': 'North America', 'Guinea': 'Africa', 'Guinea-Bissau': 'Africa',
    'Guyana': 'South America', 'Haiti': 'North America', 'Honduras': 'North America', 'Hungary': 'Europe', 'Iceland': 'Europe',
    'India': 'Asia', 'Indonesia': 'Asia', 'Iran': 'Asia', 'Iraq': 'Asia', 'Ireland': 'Europe',
    'Israel': 'Asia', 'Italy': 'Europe', 'Jamaica': 'North America', 'Japan': 'Asia', 'Jordan': 'Asia',
    'Kazakhstan': 'Asia', 'Kenya': 'Africa', 'Kiribati': 'Oceania', 'Korea (North)': 'Asia', 'Korea (South)': 'Asia',
    'Kuwait': 'Asia', 'Kyrgyzstan': 'Asia', 'Laos': 'Asia', 'Latvia': 'Europe', 'Lebanon': 'Asia',
    'Lesotho': 'Africa', 'Liberia': 'Africa', 'Libya': 'Africa', 'Liechtenstein': 'Europe', 'Lithuania': 'Europe',
    'Luxembourg': 'Europe', 'Madagascar': 'Africa', 'Malawi': 'Africa', 'Malaysia': 'Asia', 'Maldives': 'Asia',
    'Mali': 'Africa', 'Malta': 'Europe', 'Marshall Islands': 'Oceania', 'Mauritania': 'Africa', 'Mauritius': 'Africa',
    'Mexico': 'North America', 'Micronesia': 'Oceania', 'Moldova': 'Europe', 'Monaco': 'Europe', 'Mongolia': 'Asia',
    'Montenegro': 'Europe', 'Morocco': 'Africa', 'Mozambique': 'Africa', 'Myanmar': 'Asia', 'Namibia': 'Africa',
    'Nauru': 'Oceania', 'Nepal': 'Asia', 'Netherlands': 'Europe', 'New Zealand': 'Oceania', 'Nicaragua': 'North America',
    'Niger': 'Africa', 'Nigeria': 'Africa', 'North Macedonia': 'Europe', 'Norway': 'Europe', 'Oman': 'Asia',
    'Pakistan': 'Asia', 'Palau': 'Oceania', 'Panama': 'North America', 'Papua New Guinea': 'Oceania', 'Paraguay': 'South America',
    'Peru': 'South America', 'Philippines': 'Asia', 'Poland': 'Europe', 'Portugal': 'Europe', 'Qatar': 'Asia',
    'Romania': 'Europe', 'Russia': 'Europe', 'Rwanda': 'Africa', 'Saint Kitts and Nevis': 'North America', 'Saint Lucia': 'North America',
    'Saint Vincent and the Grenadines': 'North America', 'Samoa': 'Oceania', 'San Marino': 'Europe', 'Sao Tome and Principe': 'Africa', 'Saudi Arabia': 'Asia',
    'Senegal': 'Africa', 'Serbia': 'Europe', 'Seychelles': 'Africa', 'Sierra Leone': 'Africa', 'Singapore': 'Asia',
    'Slovakia': 'Europe', 'Slovenia': 'Europe', 'Solomon Islands': 'Oceania', 'Somalia': 'Africa', 'South Africa': 'Africa',
    'South Sudan': 'Africa', 'Spain': 'Europe', 'Sri Lanka': 'Asia', 'Sudan': 'Africa', 'Suriname': 'South America',
    'Sweden': 'Europe', 'Switzerland': 'Europe', 'Syria': 'Asia', 'Taiwan': 'Asia', 'Tajikistan': 'Asia',
    'Tanzania': 'Africa', 'Thailand': 'Asia', 'Timor-Leste': 'Asia', 'Togo': 'Africa', 'Tonga': 'Oceania',
    'Trinidad and Tobago': 'North America', 'Tunisia': 'Africa', 'Turkey': 'Asia', 'Turkmenistan': 'Asia', 'Tuvalu': 'Oceania',
    'Uganda': 'Africa', 'Ukraine': 'Europe', 'United Arab Emirates': 'Asia', 'United Kingdom': 'Europe', 'United States': 'North America',
    'Uruguay': 'South America', 'Uzbekistan': 'Asia', 'Vanuatu': 'Oceania', 'Vatican City': 'Europe', 'Venezuela': 'South America',
    'Vietnam': 'Asia', 'Yemen': 'Asia', 'Zambia': 'Africa', 'Zimbabwe': 'Africa', 'Hong Kong': 'Asia', 'Macau': 'Asia', 'Taiwan': 'Asia', 'Kosovo': 'Europe',
    'Northern Cyprus': 'Europe', 'Western Sahara': 'Africa', 'Somaliland': 'Africa', 'Transnistria': 'Europe',
    'Nagorno-Karabakh': 'Europe', 'Cook Islands': 'Oceania', 'Niue': 'Oceania', 'Tokelau': 'Oceania', 'Sahrawi Arab Democratic Republic': 'Africa'
};


function updateStats(selectedFlights, monthFilter) {
    const totalFlights = selectedFlights.length;
    const totalAirports = [...new Set(selectedFlights.flatMap(f => [f.dep_airport_name, f.arr_airport_name]))].length;
    const totalAirlines = [...new Set(selectedFlights.map(f => f.airline))].length;
    const totalAircraft = [...new Set(selectedFlights.map(f => f.aircraft_type))].length;
    const totalCountries = [...new Set(selectedFlights.flatMap(f => [f.dep_country, f.arr_country.trim()]))].length;

    document.getElementById('flightsCount').textContent = totalFlights;
    document.getElementById('airportsCount').textContent = totalAirports;
    document.getElementById('airlinesCount').textContent = totalAirlines;
    document.getElementById('aircraftCount').textContent = totalAircraft;
    document.getElementById('countryCount').textContent = totalCountries;

    const airportCounts = {};
    const airlineCounts = {};
    const aircraftCounts = {};
    const cc = {};
    const yearmonth = {};
    const continentpresent = new Set();
    selectedFlights.forEach(flight => {
        airportCounts[flight.dep_airport_name] = (airportCounts[flight.dep_airport_name] || 0) + 1;
        airportCounts[flight.arr_airport_name] = (airportCounts[flight.arr_airport_name] || 0) + 1;
        airlineCounts[flight.airline] = (airlineCounts[flight.airline] || 0) + 1;
        aircraftCounts[flight.aircraft_type] = (aircraftCounts[flight.aircraft_type] || 0) + 1;
        cc[flight.dep_country] = (cc[flight.dep_country] || 0) + 1;
        cc[flight.arr_country.trim()] = (cc[flight.arr_country.trim()] || 0) + 1;
        continentpresent.add(continents[flight.dep_country]);
        continentpresent.add(continents[flight.arr_country.trim()]);
        if (!yearmonth[flight.year]) {
            yearmonth[flight.year] = {};
        }
        if (!yearmonth[flight.year][flight.month]) {
            yearmonth[flight.year][flight.month] = 0;
        }
        yearmonth[flight.year][flight.month] += 1;
    });

    const years = Object.keys(yearmonth).map(year => parseInt(year));

    if (years.length > 1) {
        drawChartForYears(yearmonth);
    } else {
        drawChartForMonths(yearmonth[years[0]], monthFilter);
    }

function drawChartForYears(yearmonthData) {
    const years = Object.keys(yearmonthData).map(year => parseInt(year));
    const flightCounts = years.map(year => {
        return Object.values(yearmonthData[year]).reduce((sum, count) => sum + count, 0);
    });

    renderBarChart({
        labels: years,
        data: flightCounts,
        label: 'Flights per Year',
        xLabel: 'Years',
        yLabel: 'Flights'
    });
}

function drawChartForMonths(monthData, monthFilter) {
    const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // if monthData is undefined, set monthFilter to 0
    if (!monthData) {
            monthData = {0: 0};
    }
    const flightCounts = allMonths.map(month => monthData[month] || 0);
    
    renderBarChart({
        labels: monthNames,
        data: flightCounts,
        label: 'Flights per Month',
        xLabel: 'Months',
        yLabel: 'Flights'
    });
}

function renderBarChart({ labels, data, label, xLabel, yLabel }) {
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');

    // Destroy any existing chart
    let existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const hasData = data && data.length > 0;

    const chartConfig = {
        type: 'bar',
        data: {
            labels: hasData ? labels : [],
            datasets: [{
                label: label,
                data: hasData ? data : [],
                backgroundColor: '#7b4d2e',
                borderColor: '#7b4d2e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20
                }
            },
            scales: {
                x: {
                    title: {
                        display: hasData,
                        text: xLabel,
                        font: {
                            size: 16
                        }
                    },
                    ticks: {
                        display: hasData
                    }
                },
                y: {
                    title: {
                        display: hasData,
                        text: yLabel,
                        font: {
                            size: 16
                        }
                    },
                    beginAtZero: true,
                    ticks: {
                        display: hasData,
                        padding: 5
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: hasData
                },
                legend: {
                    display: false
                },
            },
            animation: {
                onComplete: function(animation) {
                    if (hasData) {
                        const chartInstance = animation.chart;
                        const ctx = chartInstance.ctx;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.font = '12px Arial';
                        ctx.fillStyle = 'black';
                        chartInstance.data.datasets.forEach(function(dataset, i) {
                            const meta = chartInstance.getDatasetMeta(i);
                            meta.data.forEach(function(bar, index) {
                                const data = dataset.data[index];
                                ctx.fillText(data, bar.x, bar.y - 5);
                            });
                        });
                    }
                }
            }
        }
    };

    const newChart = new Chart(ctx, chartConfig);

    if (!hasData) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const noDataText = 'No data available';
        const textX = canvas.width / 2;
        const textY = canvas.height / 2;
        ctx.font = '20px Arial';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(noDataText, textX, textY);
    }

    return newChart;
}
   const countryCounts = {};
    continentpresent.forEach(cont => {
        const countries = Object.entries(cc)
            .filter(([country, count]) => continents[country] === cont)
            .sort((a, b) => b[1] - a[1]);
        countryCounts[cont] = countries;
    });

    const flightdetails = {};
    for (const flight in selectedFlights) {
        flightdetails[`${selectedFlights[flight].airline} - ${selectedFlights[flight].flight_number}`] = `${selectedFlights[flight].dep_airport} ➠ ${selectedFlights[flight].arr_airport}`;
    }

    const aircraftFamilies = {};
    const airlineFamilies = {};
    const airportCountries = {};
    selectedFlights.forEach(flight => {
        arf = flight.airline_family.trim();
        if (!aircraftFamilies[flight.aircraft_family]) aircraftFamilies[flight.aircraft_family] = {};
        aircraftFamilies[flight.aircraft_family][flight.aircraft_type] = (aircraftFamilies[flight.aircraft_family][flight.aircraft_type] || 0) + 1;

        if (!airlineFamilies[arf]) airlineFamilies[arf] = {};
        airlineFamilies[arf][flight.airline] = (airlineFamilies[arf][flight.airline] || 0) + 1;

        if (!airportCountries[flight.dep_country]) airportCountries[flight.dep_country] = {};
        if (!airportCountries[flight.arr_country.trim()]) airportCountries[flight.arr_country.trim()] = {};
        airportCountries[flight.dep_country][flight.dep_airport_name] = (airportCountries[flight.dep_country][flight.dep_airport_name] || 0) + 1;
        airportCountries[flight.arr_country.trim()][flight.arr_airport_name] = (airportCountries[flight.arr_country.trim()][flight.arr_airport_name] || 0) + 1;
    });

    populateGroupedDetails('aircraftDetails', aircraftFamilies);
    populateGroupedDetails('airlinesDetails', airlineFamilies);
    populateGroupedDetails('airportsDetails', airportCountries);
    populateDetailscon('countryDetails', Object.entries(countryCounts));
    populateDetails('flightsDetails', Object.entries(flightdetails));

    function populateGroupedDetails(sectionId, groupedData) {
    const section = document.getElementById(sectionId);
    section.innerHTML = '';

    Object.entries(groupedData).forEach(([group, items]) => {
        const groupHeader = document.createElement('h3');
        groupHeader.innerText = group;
        section.appendChild(groupHeader);

        const bar = document.createElement('div');
        bar.classList.add('group-bar');
        section.appendChild(bar);

        Object.entries(items)
            .sort((a, b) => b[1] - a[1])
            .forEach(([item, count]) => {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                detailItem.innerHTML = `
                    <span>${item}</span>
                    <span>${count}</span>
                `;
                section.appendChild(detailItem);
            });
        section.appendChild(document.createElement('hr'));
    });
}

function populateDetailscon(sectionId, details) {
        const section = document.getElementById(sectionId);
        section.innerHTML = ''; // Clear existing content

        Object.entries(countryCounts).forEach(([continent, countries]) => {
            // Create continent header
            const continentHeader = document.createElement('h3');
            continentHeader.innerText = `${continent}`;
            section.appendChild(continentHeader);

            // Create a bar below the continent name
            const bar = document.createElement('div');
            bar.classList.add('continent-bar');  // Styling for the bar will be done via CSS
            section.appendChild(bar);

            // List countries under the continent
            countries.forEach(([country, count]) => {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                detailItem.innerHTML = `
                    <span>${countryFlags[country]} ${country}</span>
                    <span>${count}</span>
                `;
                section.appendChild(detailItem);
            });
            section.appendChild(document.createElement('hr'));
        });
    }

function populateDetails(elementId, data) {
    const detailsElement = document.getElementById(elementId);
    detailsElement.innerHTML = '';
    data.sort((a, b) => b[1] - a[1]).forEach(item => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `
            <span>${Array.isArray(item) ? item[0] : item}</span>
            <span>${Array.isArray(item) ? item[1] : ''}</span>
        `;
        detailsElement.appendChild(detailItem);
    });
}
}


function updateYearFilter() {
    const years = [...new Set(flights.map(flight => flight.year))];
    const yearFilter = document.getElementById('yearFilter');
    yearFilter.innerHTML = '<option value="all">All Years</option>';
    years.sort((a, b) => b - a).forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Initialize the page
window.onload = () => {
    initMap().then(() => {
        loadFlights();
    });
};