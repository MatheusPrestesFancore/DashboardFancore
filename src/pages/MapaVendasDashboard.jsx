// src/pages/MapaVendasDashboard.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { BuildingStorefrontIcon, MapPinIcon } from '@heroicons/react/24/solid';
import L from 'leaflet'; // Importa a biblioteca Leaflet para ícones customizados

// Componente auxiliar para mudar a visão do mapa dinamicamente
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Definição de ícones customizados
const implementedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const soldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


const MapaVendasDashboard = ({ data }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const { vendidas, implementadas } = useMemo(() => {
    if (!data) return { vendidas: [], implementadas: [] };
    const vendidas = data.filter(c => c.status === 'Vendida').sort((a, b) => a.city.localeCompare(b.city));
    const implementadas = data.filter(c => c.status === 'Implementada').sort((a, b) => a.city.localeCompare(b.city));
    return { vendidas, implementadas };
  }, [data]);

  const initialPosition = [-15.7801, -47.9292]; // Centro do Brasil

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Carregando dados do mapa ou não há locais para exibir...</p>
      </div>
    );
  }

  const CityList = ({ title, cities, icon, bgColor }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className={`text-lg font-bold mb-3 flex items-center ${bgColor}`}>
        {icon}
        <span className="ml-2">{title} ({cities.length})</span>
      </h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        <div className="space-y-2">
          {cities.map(city => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={`w-full text-left p-2 rounded-md transition-colors text-sm ${selectedCity?.id === city.id ? 'bg-orange-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
            >
              {city.city} - {city.state}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
      {/* Coluna das Tabelas */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <CityList
          title="Cidades Implementadas"
          cities={implementadas}
          icon={<BuildingStorefrontIcon className="h-6 w-6" />}
          bgColor="text-green-400"
        />
        <CityList
          title="Cidades Vendidas"
          cities={vendidas}
          icon={<MapPinIcon className="h-6 w-6" />}
          bgColor="text-orange-400"
        />
      </div>

      {/* Coluna do Mapa */}
      <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={initialPosition} zoom={4} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <ChangeView center={selectedCity ? [selectedCity.lat, selectedCity.lng] : initialPosition} zoom={selectedCity ? 13 : 4} />
          {/* ALTERADO: A URL do TileLayer foi trocada para um tema mais claro e moderno */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {data.map(city => (
            <Marker
              key={city.id}
              position={[city.lat, city.lng]}
              icon={city.status === 'Implementada' ? implementedIcon : soldIcon}
            >
              <Popup>
                <div className="font-sans">
                  <h4 className="font-bold text-base">{city.city}, {city.state}</h4>
                  <p className={city.status === 'Implementada' ? 'text-green-600' : 'text-orange-500'}>
                    Status: {city.status}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapaVendasDashboard;

