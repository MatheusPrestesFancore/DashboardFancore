import React from 'react';

// Este é um "componente burro" (dumb component).
// Ele não tem lógica própria, apenas recebe o valor e a função para alterá-lo.
const DateFilterTypeDropdown = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="dateFilterType" className="block text-sm font-medium text-gray-400 mb-1">
        Filtrar por data de:
      </label>
      <select
        id="dateFilterType"
        value={value} // 1. Recebe o valor atual do filtro via props
        onChange={e => onChange(e.target.value)} // 2. Chama a função onChange passada via props
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="custom_created_date">Criação do Lead</option>
        <option value="any_activity">Qualquer Movimentação</option> 
        {/* Adicione outras opções aqui se necessário */}
      </select>
    </div>
  );
};

export default DateFilterTypeDropdown;