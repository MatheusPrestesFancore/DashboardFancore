import React, { useMemo } from 'react';
import DateFilterTypeDropdown from './DateFilterTypeDropdown'; // Importa o novo componente

const DashboardFilters = ({ data, filters, setFilters, activePage, origens }) => {
  // Memoiza a lista de responsáveis com base na página ativa
  const responsaveis = useMemo(() => {
    let key = 'Responsável';
    if (activePage === 'sdr') key = 'Responsável SDR';
    if (activePage === 'closer') key = 'Responsável Closer';
    
    return ['Todos', ...new Set(data.map(d => d[key]).filter(Boolean))];
  }, [data, activePage]);

  // Memoiza a lista de etapas
  const etapas = useMemo(() => ['Todas', ...new Set(data.map(d => d['Etapa Atual']).filter(Boolean))], [data]);

  // Função genérica para atualizar o estado dos filtros
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Define a visibilidade de filtros específicos com base na página
  const showEtapaFilter = !['sdr', 'closer', 'cac'].includes(activePage);
  const showDateFilterType = ['sdr', 'closer'].includes(activePage); // Mostra o novo dropdown apenas em 'sdr' e 'closer'

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end`}>
        
        {/* Filtro de Responsável */}
        <div>
          <label htmlFor="responsavel" className="block text-sm font-medium text-gray-400 mb-1">Responsável</label>
          <select 
            id="responsavel" 
            value={filters.responsavel} 
            onChange={e => handleFilterChange('responsavel', e.target.value)} 
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {responsaveis.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Filtro de Origem */}
        <div>
          <label htmlFor="origem" className="block text-sm font-medium text-gray-400 mb-1">Origem</label>
          <select 
            id="origem" 
            value={filters.origem} 
            onChange={e => handleFilterChange('origem', e.target.value)} 
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {origens.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        
        {/* Filtro de Etapa (Condicional) */}
        {showEtapaFilter && (
          <div>
            <label htmlFor="etapa" className="block text-sm font-medium text-gray-400 mb-1">Etapa Atual</label>
            <select 
              id="etapa" 
              value={filters.etapa} 
              onChange={e => handleFilterChange('etapa', e.target.value)} 
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {etapas.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        )}

        {/* NOVO: Filtro de Tipo de Data (Condicional) */}
        {showDateFilterType && (
          <DateFilterTypeDropdown
            value={filters.dateFilterType}
            onChange={value => handleFilterChange('dateFilterType', value)}
          />
        )}

        {/* Filtro de Data de Início */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-1">Data de Início</label>
          <input 
            type="date" 
            id="startDate" 
            value={filters.startDate} 
            onChange={e => handleFilterChange('startDate', e.target.value)} 
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
          />
        </div>

        {/* Filtro de Data de Fim */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-1">Data de Fim</label>
          <input 
            type="date" 
            id="endDate" 
            value={filters.endDate} 
            onChange={e => handleFilterChange('endDate', e.target.value)} 
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
          />
        </div>
        
      </div>
    </div>
  );
};

export default DashboardFilters;