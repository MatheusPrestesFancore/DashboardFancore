import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RankingSdrDashboard = ({ allData, filters }) => {
  const [selectedSdrs, setSelectedSdrs] = useState([]);

  // Usa os filtros de data globais para filtrar os dados para o ranking
  const filteredForRanking = useMemo(() => {
    return allData.filter(d => {
        if (!filters.startDate || !filters.endDate) return true;
        const parts = d['Data_Criacao']?.split(' ')[0].split('/');
        if (parts?.length !== 3) return false;
        const leadDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        startDate.setUTCHours(0,0,0,0);
        endDate.setUTCHours(0,0,0,0);
        leadDate.setUTCHours(0,0,0,0);
        return leadDate >= startDate && leadDate <= endDate;
      });
  }, [allData, filters.startDate, filters.endDate]);

  const availableSdrs = useMemo(() => [...new Set(allData.map(d => d['Responsável SDR']).filter(Boolean))], [allData]);

  const handleSdrSelectionChange = (sdr) => {
    setSelectedSdrs(prev => 
      prev.includes(sdr) ? prev.filter(name => name !== sdr) : [...prev, sdr]
    );
  };

  const rankingData = useMemo(() => {
    return selectedSdrs.map(sdr => {
      const sdrLeads = filteredForRanking.filter(d => d['Responsável SDR'] === sdr);
      const leadsTrabalhados = sdrLeads.length;
      const agendados = sdrLeads.filter(d => d['Data_Reunião agendada']).length;
      const taxaAgendamento = leadsTrabalhados > 0 ? (agendados / leadsTrabalhados) * 100 : 0;

      return {
        name: sdr,
        'Leads Trabalhados': leadsTrabalhados,
        'Reuniões Agendadas': agendados,
        'Taxa de Agendamento (%)': taxaAgendamento.toFixed(2),
      };
    });
  }, [selectedSdrs, filteredForRanking]);

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Selecionar SDRs para Comparação</h3>
        <div className="flex flex-wrap gap-4">
          {availableSdrs.map(sdr => (
            <label key={sdr} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedSdrs.includes(sdr)}
                onChange={() => handleSdrSelectionChange(sdr)}
                className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-300">{sdr}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedSdrs.length > 0 && (
        <>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Tabela Comparativa</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                  <tr>
                    <th className="px-4 py-3">SDR</th>
                    <th className="px-4 py-3 text-center">Leads Trabalhados</th>
                    <th className="px-4 py-3 text-center">Reuniões Agendadas</th>
                    <th className="px-4 py-3 text-center">Taxa de Agendamento (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingData.map(sdr => (
                    <tr key={sdr.name} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-4 font-medium text-white">{sdr.name}</td>
                      <td className="px-4 py-4 text-center">{sdr['Leads Trabalhados']}</td>
                      <td className="px-4 py-4 text-center">{sdr['Reuniões Agendadas']}</td>
                      <td className="px-4 py-4 text-center font-bold text-blue-400">{sdr['Taxa de Agendamento (%)']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Gráfico Comparativo: Reuniões Agendadas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rankingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                <Legend wrapperStyle={{ color: '#A0AEC0' }} />
                <Bar dataKey="Reuniões Agendadas" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default RankingSdrDashboard;