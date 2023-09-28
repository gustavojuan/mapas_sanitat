
// JavaScript para mostrar/ocultar el formulario de búsqueda y cambiar entre botón de lupa y botón de cerrar
document.addEventListener("DOMContentLoaded", function () {
    const toggleSearchButton = document.getElementById("toggleSearch");
    const closeSearchButton = document.getElementById("closeSearch");
    const customSearch = document.querySelector(".custom-search");

    toggleSearchButton.addEventListener("click", function () {
        customSearch.classList.add("active");
    });

    closeSearchButton.addEventListener("click", function () {
        customSearch.classList.remove("active");
    });
});
// Datos de prueba en formato JSON


// Objeto para almacenar los filtros seleccionados
var filtrosSeleccionados = {
    modalidad: "",
    acceso: "",
    condiciones: "",
    barrio: "",
    establecimiento: "",
    finalidad: ""
};


// Crear el mapa Leaflet
var map = L.map('map').setView([38.96882219564115, -0.17762633082046364], 14);

var violetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})


// Agregar una capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
}).addTo(map);
// Crear un grupo de marcadores
var markerCluster = L.markerClusterGroup();

import {locationsData} from "./data.js";

// Agregar marcadores al grupo de clusters
locationsData.forEach(function (dato) {
    var marcador = L.marker(dato.coordenadas, {icon: violetIcon}); // Usa el icono violeta personalizado
    marcador.bindPopup("<b>" + dato.nombre + "</b><br>" + dato.descripcion);
    markerCluster.addLayer(marcador);
});

map.addLayer(markerCluster);


// Función para crear opciones únicas en un select y almacenar los filtros seleccionados
// Función para crear opciones únicas en un select y almacenar los filtros seleccionados
function agregarOpcionesUnicas(selectId, campo) {
    var select = document.getElementById(selectId);
    var opciones = [];

    // Agregar la opción "Mostrar Todos" al select
    var mostrarTodosOption = document.createElement("option");
    mostrarTodosOption.value = "";
    mostrarTodosOption.text = "Mostrar Todos";
    select.appendChild(mostrarTodosOption);

    locationsData.forEach(function (dato) {
        if (dato.hasOwnProperty(campo)) {
            var valor = dato[campo];
            if (!opciones.includes(valor)) {
                opciones.push(valor);
                var option = document.createElement("option");
                option.value = valor;
                option.text = valor;
                select.appendChild(option);
            }
        }
    });

    // Agregar un evento de cambio al select para actualizar el filtro seleccionado
    select.addEventListener("change", function () {
        filtrosSeleccionados[campo] = select.value;
        aplicarFiltros(); // Llamar a la función aplicarFiltros al cambiar el filtro
    });
}


// Agregar opciones únicas a los selects
agregarOpcionesUnicas("modalidad", "modalidad");
agregarOpcionesUnicas("acceso", "acceso");
agregarOpcionesUnicas("condiciones", "condiciones");
agregarOpcionesUnicas("barrio", "barrio");
agregarOpcionesUnicas("establecimiento", "establecimiento");
agregarOpcionesUnicas("finalidad", "finalidad");


// Función para aplicar los filtros al mapa
function aplicarFiltros() {
    markerCluster.clearLayers(); // Eliminar los clusters y marcadores actuales

    datos.forEach(function (dato) {
        var marcador = L.marker(dato.coordenadas, {icon: violetIcon}); // Usa el icono violeta personalizado

        // Comprobar si el marcador cumple con los filtros seleccionados
        var cumpleFiltros = true;
        for (var filtro in filtrosSeleccionados) {
            if (filtrosSeleccionados[filtro] && dato[filtro] !== filtrosSeleccionados[filtro]) {
                cumpleFiltros = false;
                break;
            }
        }

        if (cumpleFiltros) {
            marcador.bindPopup("<b>" + dato.nombre + "</b><br>" + dato.descripcion);
            markerCluster.addLayer(marcador);
        }
    });

    map.addLayer(markerCluster); // Agregar el grupo de clusters actualizado al mapa
}



