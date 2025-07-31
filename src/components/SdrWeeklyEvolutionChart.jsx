import React, { useMemo } from 'react';
import { QUALIFIED_STAGES } from '../utils/helpers'; // Importa a constante partilhada

const formatDate = (date) => { /* ... */ };
const getSaturdayWeekLabel = (dateStr) => { /* ... */ };

const WeeklyPerformanceTable = ({ data }) => {
  const weeklyData = useMemo(() => {
    const weeks = {};

    data.forEach(lead => {
      const weekLabel = getSaturdayWeekLabel(lead['Data_Criacao']);
      if (!weekLabel) return;

      if (!weeks[weekLabel]) {
        weeks[weekLabel] = {
          leads: 0, qualificados: 0, agendados: 0,
          realizados: 0, noshow: 0, vendas: 0,
        };
      }

      weeks[weekLabel].leads += 1;
      if (QUALIFIED_STAGES.some(stage => lead[stage])) weeks[weekLabel].qualificados += 1;
      if (lead['Data_Reunião agendada']) weeks[weekLabel].agendados += 1;
      if (lead['Data_Reunião realizada']) weeks[weekLabel].realizados += 1;
      if (lead['Data_Noshow']) weeks[weekLabel].noshow += 1;
      if (lead['Data_Venda']) weeks[weekLabel].vendas += 1;
    });

    return Object.entries(weeks).map(([label, values]) => ({ label, ...values })).sort(/* ... */);
  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Performance Semanal</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Semana</th>
              <th scope="col" className="px-4 py-3 text-center">Leads</th>
              <th scope="col" className="px-4 py-3 text-center">Qualificados</th>
              <th scope="col" className="px-4 py-3 text-center">Agendados</th>
              <th scope="col" className="px-4 py-3 text-center">Realizados</th>
              <th scope="col" className="px-4 py-3 text-center">Noshow</th>
              <th scope="col" className="px-4 py-3 text-center">Vendas</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((week) => (
              <tr key={week.label} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-4 font-medium text-white">{week.label}</td>
                <td className="px-4 py-4 text-center">{week.leads}</td>
                <td className="px-4 py-4 text-center">{week.qualificados}</td>
                <td className="px-4 py-4 text-center">{week.agendados}</td>
                <td className="px-4 py-4 text-center">{week.realizados}</td>
                <td className="px-4 py-4 text-center">{week.noshow}</td>
                <td className="px-4 py-4 text-center">{week.vendas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyPerformanceTable;