import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SdrEvolutionChart = ({ data, selectedSdrs }) => {
  // --- PALETA DE CORES ATUALIZADA ---
  const colors = ['#f97316', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

  const chartData = useMemo(() => {
    const dailyData = {};
    
    data.forEach(lead => {
      if (lead['Data_Reunião agendada']) {
        const dateStr = lead['Data_Reunião agendada'].split(' ')[0];
        const parts = dateStr.split('/');
        if (parts.length !== 3) return;
        const formattedDate = `${parts[0]}/${parts[1]}`; // Formato DD/MM

        if (!dailyData[formattedDate]) {
          dailyData[formattedDate] = { name: formattedDate };
        }

        const sdr = lead['Responsável SDR'];
        if (selectedSdrs.includes(sdr)) {
          if (!dailyData[formattedDate][sdr]) {
            dailyData[formattedDate][sdr] = 0;
          }
          dailyData[formattedDate][sdr] += 1;
        }
      }
    });

    return Object.values(dailyData).sort((a, b) => {
      const dateA = new Date(a.name.split('/').reverse().join('-'));
      const dateB = new Date(b.name.split('/').reverse().join('-'));
      return dateA - dateB;
    });
  }, [data, selectedSdrs]);

  if (chartData.length === 0) {
    // --- COR DO TEXTO ATUALIZADA ---
    return <p className="text-gray-500 text-center py-10">Sem dados de agendamentos diários para o período selecionado.</p>;
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

export default SdrEvolutionChart;
