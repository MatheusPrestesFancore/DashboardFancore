import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatDate = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const getSaturdayWeekLabel = (dateStr) => {
  const parts = dateStr?.split(' ')[0].split('/');
  if (parts?.length !== 3) return null;
  const date = new Date(parts[2], parts[1] - 1, parts[0]);
  
  const dayOfWeek = date.getDay();
  const dateOffset = (dayOfWeek + 1) % 7;
  
  const weekStartDate = new Date(date);
  weekStartDate.setDate(date.getDate() - dateOffset);
  
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  return `${formatDate(weekStartDate)}-${formatDate(weekEndDate)}`;
};

const SdrWeeklyEvolutionChart = ({ data, selectedSdrs }) => {
  // --- PALETA DE CORES ATUALIZADA ---
  const colors = ['#f97316', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

  const chartData = useMemo(() => {
    const weeklyData = {};

    data.forEach(lead => {
      if (lead['Data_Reunião agendada']) {
        const weekLabel = getSaturdayWeekLabel(lead['Data_Reunião agendada']);
        if (!weekLabel) return;

        if (!weeklyData[weekLabel]) {
          weeklyData[weekLabel] = { name: weekLabel };
        }

        const sdr = lead['Responsável SDR'];
        if (selectedSdrs.includes(sdr)) {
          if (!weeklyData[weekLabel][sdr]) {
            weeklyData[weekLabel][sdr] = 0;
          }
          weeklyData[weekLabel][sdr] += 1;
        }
      }
    });

    return Object.values(weeklyData).sort((a, b) => {
      const dateA = new Date(a.name.slice(0, 5).split('/').reverse().join('-'));
      const dateB = new Date(b.name.slice(0, 5).split('/').reverse().join('-'));
      return dateA - dateB;
    });
  }, [data, selectedSdrs]);

  if (chartData.length === 0) {
    // --- COR DO TEXTO ATUALIZADA ---
    return <p className="text-gray-500 text-center py-10">Sem dados de agendamentos semanais para o período selecionado.</p>;
  }

  return (
    // --- CORES DO GRÁFICO ATUALIZADAS ---
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" allowDecimals={false} />
        <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
            cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af' }} />
        {selectedSdrs.map((sdr, index) => (
          <Line 
            key={sdr} 
            type="monotone" 
            dataKey={sdr} 
            stroke={colors[index % colors.length]} 
            strokeWidth={2}
            dot={{ r: 4, fill: colors[index % colors.length] }}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SdrWeeklyEvolutionChart;
