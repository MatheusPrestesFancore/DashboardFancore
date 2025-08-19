import React, { useMemo } from 'react';

const DashboardFilters = ({ data, filters, setFilters, activePage, origens }) => { // 1. Recebe 'origens' como prop
  const responsaveis = useMemo(() => {
    let key = 'Responsável';
    if (activePage === 'sdr') key = 'Responsável SDR';
    if (activePage === 'closer') key = 'Responsável Closer';
    
    return ['Todos', ...new Set(data.map(d => d[key]).filter(Boolean))];
  }, [data, activePage]);

  const etapas = useMemo(() => ['Todas', ...new Set(data.map(d => d['Etapa Atual']).filter(Boolean))], [data]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const showEtapaFilter = !['sdr', 'closer', 'cac'].includes(activePage);

   return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      {/* O grid se ajustará automaticamente */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end`}>
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
        
        {showEtapaFilter && (
          // ... seu filtro de Etapa (sem alterações)
        )}

        {/* 3. Renderiza o novo componente condicionalmente */}
        {showDateFilterType && (
          <DateFilterTypeDropdown
            value={filters.dateFilterType} // Passa o valor do estado para o componente
            onChange={value => handleFilterChange('dateFilterType', value)} // Passa a função para atualizar o estado
          />
        )}

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