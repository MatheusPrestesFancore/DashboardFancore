import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SdrEvolutionChart = ({ data, selectedSdrs }) => {
  // **CORREÇÃO APLICADA AQUI**
  // A paleta de cores foi movida para fora do 'useMemo' para ser acessível no return.
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

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

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Evolução Diária: Reuniões Agendadas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
          <Legend wrapperStyle={{ color: '#A0AEC0' }} />
          {selectedSdrs.map((sdr, index) => (
            <Line 
              key={sdr} 
              type="monotone" 
              dataKey={sdr} 
              stroke={colors[index % colors.length]} 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SdrEvolutionChart;