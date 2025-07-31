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
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

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

  return (
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
  );
};

export default SdrWeeklyEvolutionChart;