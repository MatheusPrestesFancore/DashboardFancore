import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { BuildingStorefrontIcon, MapPinIcon } from '@heroicons/react/24/solid';
import L from 'leaflet';
import CityDetailPanel from '../components/CityDetailPanel';

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) { map.flyTo(center, zoom, { animate: true, duration: 1.5 }); }
  }, [center, zoom, map]);
  return null;
}

const implementedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const soldIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const MapaVendasDashboard = ({ data }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const { vendidas, implementadas } = useMemo(() => {
    if (!data) return { vendidas: [], implementadas: [] };
    const vendidas = data.filter(c => c.status === 'Vendida' && c.city).sort((a, b) => a.city.localeCompare(b.city));
    const implementadas = data.filter(c => c.status === 'Implementada' && c.city).sort((a, b) => a.city.localeCompare(b.city));
    return { vendidas, implementadas };
  }, [data]);

  const initialPosition = [-15.7801, -47.9292];

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
      <div className="max-h-48 md:max-h-60 overflow-y-auto pr-2">
        <div className="space-y-2">
          {cities.map((city, index) => (
            <button 
              key={`${city.id || city.city}-${index}`} 
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[75vh] relative overflow-hidden">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <CityList title="Cidades Implementadas" cities={implementadas} icon={<BuildingStorefrontIcon className="h-6 w-6" />} bgColor="text-green-400" />
        <CityList title="Cidades Vendidas" cities={vendidas} icon={<MapPinIcon className="h-6 w-6" />} bgColor="text-orange-400" />
      </div>

      <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg h-96 lg:h-full">
        <MapContainer center={initialPosition} zoom={4} style={{ height: '100%', width: '100%', zIndex: 1 }} scrollWheelZoom={true}>
          <ChangeView center={selectedCity ? [selectedCity.lat, selectedCity.lng] : initialPosition} zoom={selectedCity ? 13 : 4} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>' />
          
          {data.map((city, index) => (
            city.lat && city.lng && (
              <Marker 
                key={`${city.id || city.city}-${city.state}-${index}`} 
                position={[city.lat, city.lng]} 
                icon={city.status === 'Implementada' ? implementedIcon : soldIcon}
                eventHandlers={{ click: () => { setSelectedCity(city); } }}
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
            )
          ))}
        </MapContainer>
      </div>

      <CityDetailPanel city={selectedCity} onClose={() => setSelectedCity(null)} />
    </div>
  );
};

export default MapaVendasDashboard;