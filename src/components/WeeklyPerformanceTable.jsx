import React, { useMemo } from 'react';

// Função auxiliar para formatar datas no formato DD/MM
const formatDate = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

// Função para identificar a "Semana Fancore" (Sábado a Sexta)
const getFancoreWeek = (dateStr) => {
  const parts = dateStr?.split(' ')[0].split('/');
  if (parts?.length !== 3) return null;
  // Cria a data no formato correto para evitar problemas com fuso horário
  const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
  
  const dayOfWeek = date.getUTCDay(); // 0 (Dom) a 6 (Sáb)
  
  // Calcula o offset para encontrar o Sábado anterior (ou o próprio dia, se for Sábado)
  // Se o dia for Sábado (6), offset é 0. Se for Dom (0), offset é 1. Se for Sex (5), offset é 6.
  const dateOffset = (dayOfWeek + 1) % 7; 
  
  const weekStartDate = new Date(date);
  weekStartDate.setUTCDate(date.getUTCDate() - dateOffset);
  
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 6);

  // Retorna um objeto com a data de início (para ordenação) e o rótulo
  return {
    startDate: weekStartDate,
    label: `${formatDate(weekStartDate)} ATÉ ${formatDate(weekEndDate)}`
  };
};

const QUALIFIED_STAGES_TABLE = [
  'Data_Segundo contato', 'Data_Terceiro contato', 'Data_Quarto contato', 'Data_Quinto contato',
  'Data_Contato IA', 'Data_Reunião agedada', 'Data_Reunião feita', 'Data_COF Enviada',
  'Data_COF Assinada'
];

const WeeklyPerformanceTable = ({ data }) => {
  const weeklyData = useMemo(() => {
    const weeks = {};

    data.forEach(lead => {
      const week = getFancoreWeek(lead['Data_Criacao']);
      if (!week) return;

      const { label, startDate } = week;

      if (!weeks[label]) {
        weeks[label] = {
          startDate, // Armazena a data de início para ordenação
          leads: 0,
          qualificados: 0,
          agendados: 0,
          realizados: 0,
          vendas: 0,
        };
      }

      // Incrementa os contadores para a semana correspondente
      weeks[label].leads += 1;
      if (QUALIFIED_STAGES_TABLE.some(stage => lead[stage])) weeks[label].qualificados += 1;
      // CORRIGIDO: Nomes das colunas atualizados
      if (lead['Data_Reunião agedada']) weeks[label].agendados += 1;
      if (lead['Data_Reunião feita']) weeks[label].realizados += 1;
      if (lead['Data_COF Assinada']) weeks[label].vendas += 1;
    });

    // Converte o objeto em array, ordena pela data de início e pega as 4 últimas semanas
    return Object.entries(weeks)
      .map(([label, values]) => ({ label, ...values }))
      .sort((a, b) => b.startDate - a.startDate) // Ordena da mais recente para a mais antiga
      .slice(0, 4); // Pega apenas os 4 primeiros (as 4 últimas semanas)

  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Performance Semanal (Últimas 4 Semanas)</h3>
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