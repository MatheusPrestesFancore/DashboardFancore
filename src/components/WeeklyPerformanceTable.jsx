import React, { useMemo } from 'react';

// Função auxiliar para formatar datas no formato DD/MM
const formatDate = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

// Função auxiliar para obter o rótulo da semana (Sábado - Sexta)
const getSaturdayWeekLabel = (dateStr) => {
  const parts = dateStr?.split(' ')[0].split('/');
  if (parts?.length !== 3) return null;
  const date = new Date(parts[2], parts[1] - 1, parts[0]);
  
  const dayOfWeek = date.getDay(); // 0=Domingo, 6=Sábado
  const dateOffset = (dayOfWeek + 1) % 7; // Sábado=0, Domingo=1...
  
  const weekStartDate = new Date(date);
  weekStartDate.setDate(date.getDate() - dateOffset);
  
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  return `${formatDate(weekStartDate)} ATÉ ${formatDate(weekEndDate)}`;
};

const WeeklyPerformanceTable = ({ data }) => {
  const weeklyData = useMemo(() => {
    const weeks = {};

    data.forEach(lead => {
      const weekLabel = getSaturdayWeekLabel(lead['Data_Criacao']);
      if (!weekLabel) return;

      if (!weeks[weekLabel]) {
        weeks[weekLabel] = {
          leads: 0,
          qualificados: 0,
          agendados: 0,
          realizados: 0,
          vendas: 0,
        };
      }

      weeks[weekLabel].leads += 1;
      if (lead['Data_Primeiro contato']) weeks[weekLabel].qualificados += 1;
      if (lead['Data_Reunião agendada']) weeks[weekLabel].agendados += 1;
      if (lead['Data_Reunião realizada']) weeks[weekLabel].realizados += 1;
      if (lead['Data_Venda']) weeks[weekLabel].vendas += 1;
    });

    // Converte o objeto para um array e ordena
    return Object.entries(weeks)
      .map(([label, values]) => ({ label, ...values }))
      .sort((a, b) => {
        const dateA = new Date(a.label.slice(0, 5).split('/').reverse().join('-'));
        const dateB = new Date(b.label.slice(0, 5).split('/').reverse().join('-'));
        return dateB - dateA;
      });

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