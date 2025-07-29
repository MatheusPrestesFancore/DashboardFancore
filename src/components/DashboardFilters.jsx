import React, { useMemo } from 'react'; 

const DashboardFilters = ({ data, filters, setFilters }) => {
  const responsaveis = useMemo(() => ['Todos', ...new Set(data.map(d => d['Responsável']).filter(Boolean))], [data]);
  const etapas = useMemo(() => ['Todas', ...new Set(data.map(d => d['Etapa Atual']).filter(Boolean))], [data]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="responsavel" className="block text-sm font-medium text-gray-400 mb-1">Responsável</label>
          <select id="responsavel" value={filters.responsavel} onChange={e => handleFilterChange('responsavel', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {responsaveis.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="etapa" className="block text-sm font-medium text-gray-400 mb-1">Etapa Atual</label>
          <select id="etapa" value={filters.etapa} onChange={e => handleFilterChange('etapa', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {etapas.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-1">Data de Início</label>
          <input type="date" id="startDate" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-1">Data de Fim</label>
          <input type="date" id="endDate" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters; 
