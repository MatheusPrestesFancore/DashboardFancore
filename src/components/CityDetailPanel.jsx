import React from 'react';
import { XMarkIcon, MapIcon } from '@heroicons/react/24/solid';

const CityDetailPanel = ({ city, onClose }) => {
  if (!city) return null;

  return (
    // Painel que desliza da direita, com z-index alto para ficar sobre o mapa
    <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-gray-800 shadow-lg z-[1000] p-6 flex flex-col transform transition-transform duration-300 ease-in-out">
      
      {/* Cabeçalho com título e botão de fechar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">{city.city}, {city.state}</h2>
        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Corpo com os detalhes */}
      <div className="space-y-4 text-gray-300 flex-grow">
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase">Status</h4>
          <p className={`font-semibold ${city.status === 'Implementada' ? 'text-green-400' : 'text-orange-400'}`}>
            {city.status}
          </p>
        </div>
        
        {/* Só mostra a Data da Venda se ela existir na planilha */}
        {city.saleDate && (
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase">Data da Venda</h4>
            <p>{city.saleDate}</p>
          </div>
        )}
        
        {/* Só mostra a Data da Inauguração se ela existir na planilha */}
        {city.implementationDate && (
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase">Data da Inauguração</h4>
            <p>{city.implementationDate}</p>
          </div>
        )}
      </div>
      
      {/* Rodapé com o link para o Google Maps */}
      {city.googleMapsUrl && (
        <div className="mt-auto pt-6 border-t border-gray-700">
          <a
            href={city.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <MapIcon className="h-5 w-5 mr-2" />
            Ver Localização e Fotos
          </a>
        </div>
      )}
    </div>
  );
};

export default CityDetailPanel;