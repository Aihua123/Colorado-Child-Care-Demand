// reading our geojson file
var tableData = JSON.parse(data);
console.log(tableData[0])

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
}).addTo(SMap);


// creating our heatmap layers
var geojson4 = L.geoJSON(tableData, { style: styleYA, onEachFeature: onEachFeatureYA }).addTo(SMap);
var geojson5 = L.geoJSON(tableData, { style: styleOA, onEachFeature: onEachFeatureOA });


// this control the map color based on the ratio 
// two funtions beacsue we have two layers
function getColor(d) {
    return d == 'Capacity growed from 0' ? '#0000FF' :
        d >= 0 ? '#32CD32' :
            d >= -0.01 ? '#B22222' :
                d >= -0.1 ? '#DC143C' :
                    d >= -2 ? '#FF0000' :
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
// We have two functions because we have two layers
function onEachFeatureYA(feature, layer) {
    layer.on({
        mouseover: highlightFeature1,
        mouseout: resetHighlight1,
        click: zoomToFeature
    });
}

function onEachFeatureOA(feature, layer) {
    layer.on({
        mouseover: highlightFeature2,
        mouseout: resetHighlight2,
        click: zoomToFeature
    });
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


function resetHighlight1(e) {
    geojson4.resetStyle(e.target);
    info_YA.update();
}

function resetHighlight2(e) {
    geojson5.resetStyle(e.target);
    info_OA.update();
}

function zoomToFeature(e) {
    SMap.fitBounds(e.target.getBounds());
}


// setting up our info layers
// we have two because we have two layers
var info_YA = L.control();

info_YA.onAdd = function (SMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info_YA.update = function (props) {
    this._div.innerHTML = '<h4>Pop Growth Rate Vs Capa Growth Rate</h4>' + (props ?
        '<b>' + props.ZCTA5CE10 + '</b><br />'
        + 'Capacity annual growth rate:  ' + props.CAPA_GAGR_I + '</b><br />'
        + 'Population annual growth rate:  ' + props.POP_GAGR_I + '</b><br />'
        + 'Capa growth minus Pop growth:  ' + props.COMPARISON_I + '</b><br />' + ''
        : 'Hover over a zip code area');
};


var info_OA = L.control();

info_OA.onAdd = function (SMap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info_OA.update = function (props) {
    this._div.innerHTML = '<h4>Pop Growth Rate Vs Capa Growth Rate</h4>' + (props ?
        '<b>' + props.ZCTA5CE10 + '</b><br />'
        + 'Capacity annual growth rate:  ' + props.CAPA_GAGR_II + '</b><br />'
        + 'Population annual growth rate:  ' + props.POP_GAGR_II + '</b><br />'
        + 'Capa growth minus Pop growth:  ' + props.COMPARISON_II + '</b><br />' + ''
        : 'Hover over a zip code area');
};

// seting up legend
// we have two becasue we have two layers
var YAlegend = L.control({ position: 'bottomright' });
YAlegend.onAdd = function (SMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-2, -0.1, -0.01, 0, 2];
    grades.forEach(function (el, index, array) {
        if (index <= 3) {
            div.innerHTML += '<i style="background:' + getColor(el) + '"></i> ' + el + " to " + array[index + 1] + '</b><br />'
        }
    })

    return div;

};


var OAlegend = L.control({ position: 'bottomright' });
OAlegend.onAdd = function (SMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-2, -0.1, -0.01, 0, 2];
    grades.forEach(function (el, index, array) {
        if (index <= 3) {
            div.innerHTML += '<i style="background:' + getColor(el) + '"></i> ' + el + " to " + array[index + 1] + '</b><br />'
        }
    })

    return div;
};

// creating our layers
var baseMaps = {
    "0-3": geojson4,
    "3-5": geojson5
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
    if (eventLayer.name === '0-3') {
        SMap.removeControl(currentLegend);
        SMap.removeControl(currentinfo);
        currentLegend = YAlegend;
        currentinfo = info_YA;
        info_YA.addTo(SMap);
        YAlegend.addTo(SMap);
        geojson4.addTo(SMap);

    } else if (eventLayer.name === '3-5') {
        SMap.removeControl(currentLegend);
        SMap.removeControl(currentinfo);
        currentLegend = OAlegend;
        currentinfo = info_OA;
        info_OA.addTo(SMap);
        OAlegend.addTo(SMap);
        geojson5.addTo(SMap);

    }
})




