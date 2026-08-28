import React from 'react';

const MapFilters = ({ availableStates, selectedState, setSelectedState }) => {
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
      <div className="max-w-xs">
        <label htmlFor="state-filter" className="block text-sm font-medium text-gray-300 mb-1">
          Filtrar por Estado
        </label>
        <select
          id="state-filter"
          name="state-filter"
          value={selectedState}
          onChange={handleStateChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {/* A primeira opção é sempre "Todos" */}
          <option value="Todos">Todos os Estados</option>
          
          {/* As outras opções são os estados disponíveis */}
          {availableStates.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MapFilters;