// src/pages/MapaVendasDashboard.jsx

import React from 'react';

// Este é um componente de esqueleto para a nova página.
// Vamos construir a tabela e o mapa aqui no próximo passo.
const MapaVendasDashboard = ({ data }) => {
  
  // Este console.log é para você verificar no navegador se os dados estão chegando corretamente.
  console.log('Dados recebidos pelo mapa:', data);

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-400">Carregando dados do mapa ou não há locais para exibir...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Mapa de Vendas e Implementação</h2>
      <p className="text-gray-300">Em breve, a tabela de cidades e o mapa interativo aparecerão aqui!</p>
      <div className="mt-4 p-4 bg-gray-900 rounded">
        <h3 className="text-lg font-semibold text-orange-500">Dados Recebidos:</h3>
        <pre className="text-sm text-gray-200 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default MapaVendasDashboard;
