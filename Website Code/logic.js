// reading our geojson file
var tableData = JSON.parse(data);
console.log(tableData[0])

var myMap = L.map("map", {
    center: [39.04, -104.59],
    zoom: 7
});

var SMap = L.map("map2", {
    center: [39.04, -104.59],
    zoom: 7
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap);

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(SMap);

// adding markers to show facilities' locations
url2 = "https://raw.githubusercontent.com/Aihua123/Colorado-Child-Care-Demand/master/facility_location_201905.json"

function make_markers() {
    d3.json(url2, function (data) {
        data.forEach(el => {
            let color;
            if (el.SERVICETYPEBYAGE == "FCC/DC/CCC") {
                color = '#FF4F93'
            } else if (el.SERVICETYPEBYAGE == "Infant/Toddler Facility") {
                color = '#00ADFF'
            } else if (el.SERVICETYPEBYAGE == "Preschool Facility") {
                color = '#63CF9B'
            } 
            
            return L.circle(el.COORDINATES, {
                color: color,
                fillColor: color,
                fillOpacity: 100,
                radius: 35
            }).addTo(myMap);
        });
    });
}

make_markers()

//create legends for the markers
function getColor_for_type(d) {
    if (d == 'FCC/DC/CCC') {
        return '#FF4F93'
    } else if (d == 'Infant/Toddler Facility') {
        return '#00ADFF'
    } else if (d == 'Preschool Facility') {
        return '#63CF9B'
    } 
}

var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        type = ['FCC/DC/CCC', 'Infant/Toddler Facility', 'Preschool Facility'];

    div.innerHTML = '<h4>Facility Type</h4>' +
    '<i style="background:' + getColor_for_type(type[0]) + '"></i> ' + type[0] + '</b><br />' +
        '<i style="background:' + getColor_for_type(type[1]) + '"></i> ' + type[1] + '</b><br />' +
        '<i style="background:' + getColor_for_type(type[2]) + '"></i> ' + type[2] + '</b><br />'

    return div;
};

legend.addTo(myMap)


// creating our heatmap layers
var geojson2 = L.geoJSON(tableData, { style: styleYA1, onEachFeature: onEachFeatureYA1 }).addTo(myMap);
var geojson3 = L.geoJSON(tableData, { style: styleOA1, onEachFeature: onEachFeatureOA1 });

var geojson4 = L.geoJSON(tableData, { style: styleYA, onEachFeature: onEachFeatureYA }).addTo(SMap);
var geojson5 = L.geoJSON(tableData, { style: styleOA, onEachFeature: onEachFeatureOA });

// this control the map color based on the ratio 
function getColor_ratio(d) {
    return d >= 40 ? '#ff1733' :
        d >= 20 ? '#ff1733' :
            d >= 15 ? '#ff4733' :
                d >= 10 ? '#ff5733' :
                    d >= 5 ? '#ff6d33' :
                        d >= 3 ? '#ff7833' :
                            d >= 1 ? '#ff9933' :
                                d >= 0 ? '#ffae00' :
                                    '#FFFFFF';
}
function styleYA1(feature) {
    return {
        fillColor: getColor_ratio(feature.properties.RATIO_I),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.5
    };
}

function styleOA1(feature) {
    return {
        fillColor: getColor_ratio(feature.properties.RATIO_II),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.5
    };
}

function getColor(d) {
    return d == 'Capacity growed from 0' ? '#A9A9A9' :
        d * 100 >= 0 ? '#81BB42' :
            d * 100 >= -20 ? '#FF4040' :
                d * 100 >= -40 ? '#CD2626' :
                    d * 100 >= -60 ? '#CD2626' :
                        d * 100 >= -100 ? '#A80000' :
                            d * 100 >= -120 ? '#A80000' :
                                'white';
}
function styleYA(feature) {
    return {
        fillColor: getColor(feature.properties.COMPARISON_I),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.5
    };
}

function styleOA(feature) {
    return {
        fillColor: getColor(feature.properties.COMPARISON_II),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.5
    };
}
// this controls the map interaction, mouse over, mouse out, zoom in activities; 
// onEachFeature functions
function onEachFeatureYA1(feature, layer) {
    layer.on({
        mouseover: highlightFeatureYA,
        mouseout: resetHighlightYA,
        click: zoomToFeature1
    });
}

function onEachFeatureOA1(feature, layer) {
    layer.on({
        mouseover: highlightFeatureOA,
        mouseout: resetHighlightOA,
        click: zoomToFeature1
    });
}

function onEachFeatureYA(feature, layer) {
    layer.on({
        mouseover: highlightFeature1,
        mouseout: resetHighlight1,
        click: zoomToFeature2
    });
}

function onEachFeatureOA(feature, layer) {
    layer.on({
        mouseover: highlightFeature2,
        mouseout: resetHighlight2,
        click: zoomToFeature2
    });
}

// functions inside onEachFeature functions
// highlight functions
function highlightFeatureYA(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.4
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();

        info_YA1.update(layer.feature.properties);
    }
}

function highlightFeatureOA(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.4
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();

        info_OA1.update(layer.feature.properties);
    }
}

function highlightFeature1(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.4
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();

        info_YA.update(layer.feature.properties);
    }
}

function highlightFeature2(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.4
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();

        info_OA.update(layer.feature.properties);
    }
}


// reset hilight functions 
function resetHighlightYA(e) {
    geojson2.resetStyle(e.target);
    info_YA1.update();
}

function resetHighlightOA(e) {
    geojson3.resetStyle(e.target);
    info_OA1.update();
}

function resetHighlight1(e) {
    geojson4.resetStyle(e.target);
    info_YA.update();
}

function resetHighlight2(e) {
    geojson5.resetStyle(e.target);
    info_OA.update();
}

// zoom functions
function zoomToFeature1(e) {
    myMap.fitBounds(e.target.getBounds());
}

function zoomToFeature2(e) {
    SMap.fitBounds(e.target.getBounds());
}


// setting up our info layers
var info_YA1 = L.control();

info_YA1.onAdd = function (myMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info_YA1.update = function (props) {
    this._div.innerHTML = '<h4>Population VS Capacity</h4>' + (props ?
        '<b>' + props.ZCTA5CE10 + '</b><br />'
        + 'Population for Children Aged 0-3: ' + props.POPULATION_I + '</b><br />'
        + 'Child Care Capacity:  ' + props.CAPACITY_I + '</b><br />'
        + 'Number of Providers:  ' + props.NUMBER_OF_PROVIDERS_I + '</b><br />'
        + 'Children per Child Care Slot:  ' + props.RATIO_I + ''
        : 'Hover over a zip code area');
};


var info_OA1 = L.control();

info_OA1.onAdd = function (myMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};


info_OA1.update = function (props) {
    this._div.innerHTML = '<h4>Population VS Capacity</h4>' + (props ?
        '<b>' + props.ZCTA5CE10 + '</b><br />'
        + 'Population for Children Aged 3-5:  ' + props.POPULATION_II + '</b><br />'
        + 'Child Care Capacity:  ' + props.CAPACITY_II + '</b><br />'
        + 'Number of Providers:  ' + props.NUMBER_OF_PROVIDERS_II + '</b><br />'
        + 'Children per Child Care Slot:  ' + props.RATIO_II + ''
        : 'Hover over a zip code area');
};

var info_YA = L.control();

info_YA.onAdd = function (SMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info_YA.update = function (props) {
    this._div.innerHTML = '<h4>2017–2019 Annual Growth Rate Comparison</h4>' + (props ?
        '<b>' + props.ZCTA5CE10 + '</b><br />'
        + 'Capacity annual growth rate:  ' + (props.CAPA_GAGR_I * 100).toFixed(2) + '%' + '</b><br />'
        + 'Population annual growth rate:  ' + (props.POP_GAGR_I * 100).toFixed(2) + '%' + '</b><br />'
        + 'Growth Margin:  ' + (props.COMPARISON_I * 100).toFixed(2) + '%' + '</b><br />' + ''
        : 'Hover over a zip code area');
};

var info_OA = L.control();

info_OA.onAdd = function (SMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info_OA.update = function (props) {
    this._div.innerHTML = '<h4>2017–2019 Annual Growth Rate Comparison</h4>' + (props ?
        '<b>' + props.ZCTA5CE10 + '</b><br />'
        + 'Capacity annual growth rate:  ' + (props.CAPA_GAGR_II * 100).toFixed(2) + '%' + '%' + '</b><br />'
        + 'Population annual growth rate:  ' + (props.POP_GAGR_II * 100).toFixed(2) + '%' + '</b><br />'
        + 'Growth Margin:  ' + (props.COMPARISON_II * 100).toFixed(2) + '%' + '</b><br />' + ''
        : 'Hover over a zip code area');
};

// seting up legends
var YAlegend1 = L.control({ position: 'bottomright' });
YAlegend1.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    grades = [0, 1, 3, 5, 10, 15, 20, 40];
    grades.forEach(function (el, index) {
        if (index < 7) {
            div.innerHTML += '<i style="background:' + getColor_ratio(el) + '"></i> '
        } else {
            div.innerHTML += '<i style="background:' + getColor_ratio(el) + '"></i> ' + '<h7>Less Supply</h7>'
        }
    })

    return div;
};

var OAlegend2 = L.control({ position: 'bottomright' });
OAlegend2.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    grades = [0, 1, 3, 5, 10, 15, 20, 40];
    grades.forEach(function (el, index) {
        if (index < 7) {
            div.innerHTML += '<i style="background:' + getColor_ratio(el) + '"></i> '
        } else {
            div.innerHTML += '<i style="background:' + getColor_ratio(el) + '"></i> ' + '<h7>Less Supply</h7>'
        }
    })
    return div;
};

var YAlegend = L.control({ position: 'bottomright' });
YAlegend.onAdd = function (SMap) {

    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<h4>Growth Margin</h4>'
    grades = [-120, -100, -60, -40, -20, 0, 150];
    grades.forEach(function (el, index, array) {
        if (index <= 5) {
            div.innerHTML += '<i style="background:' + getColor(el / 100) + '"></i> '
                + el + '%' + " to " + array[index + 1] + '%' + '</b><br />'
        }
    })

    return div;
};

var OAlegend = L.control({ position: 'bottomright' });
OAlegend.onAdd = function (SMap) {

    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<h4>Growth Margin</h4>';
    grades = [-120, -100, -60, -40, -20, 0, 150];
    grades.forEach(function (el, index, array) {
        if (index <= 5) {
            div.innerHTML += '<i style="background:' + getColor(el / 100) + '"></i> '
                + el + '%' + " to " + array[index + 1] + '%' + '</b><br />'
        }
    })
    return div;
};


// creating our first layer
var baseMaps1 = {
    "Children Ages 0-3": geojson2,
    "Children Ages 3-5": geojson3
};

var overlayMaps1 = {};

L.control.layers(baseMaps1, overlayMaps1, {
    collapsed: false,
    position: 'bottomleft'
}).addTo(myMap);

info_YA1.addTo(myMap);
currentinfo1 = info_YA1;

YAlegend1.addTo(myMap);
currentLegend1 = YAlegend1;


myMap.on('baselayerchange', function (eventLayer) {
    if (eventLayer.name === 'Children Ages 0-3') {
        myMap.removeControl(currentLegend1);
        myMap.removeControl(currentinfo1);
        currentLegend1 = YAlegend1;
        currentinfo1 = info_YA1;
        info_YA1.addTo(myMap);
        YAlegend1.addTo(myMap);
        geojson2.addTo(myMap);
        make_markers()

    } else if (eventLayer.name === 'Children Ages 3-5') {
        myMap.removeControl(currentLegend1);
        myMap.removeControl(currentinfo1);
        currentLegend1 = OAlegend2;
        currentinfo1 = info_OA1;
        info_OA1.addTo(myMap);
        OAlegend2.addTo(myMap);
        geojson3.addTo(myMap);
        make_markers()

    }
})

// creating our second layer
var baseMaps = {
    "Children Ages 0-3": geojson4,
    "Children Ages 3-5": geojson5
};

var overlayMaps = {};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    position: 'bottomleft'
}).addTo(SMap);

info_YA.addTo(SMap);
currentinfo = info_YA;

YAlegend.addTo(SMap);
currentLegend = YAlegend;


SMap.on('baselayerchange', function (eventLayer) {
    if (eventLayer.name === 'Children Ages 0-3') {
        SMap.removeControl(currentLegend);
        SMap.removeControl(currentinfo);
        currentLegend = YAlegend;
        currentinfo = info_YA;
        info_YA.addTo(SMap);
        YAlegend.addTo(SMap);
        geojson4.addTo(SMap);

    } else if (eventLayer.name === 'Children Ages 3-5') {
        SMap.removeControl(currentLegend);
        SMap.removeControl(currentinfo);
        currentLegend = OAlegend;
        currentinfo = info_OA;
        info_OA.addTo(SMap);
        OAlegend.addTo(SMap);
        geojson5.addTo(SMap);

    }
})


