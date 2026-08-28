import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Funções auxiliares para datas
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

const CloserEvolutionChart = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState('Reuniões Realizadas');

  // --- PALETA DE CORES ATUALIZADA ---
  const metrics = [
    { name: 'Reuniões Realizadas', dataKey: 'Data_Reunião feita', color: '#f59e0b' }, // Ambar
    { name: 'COFs Enviadas', dataKey: 'Data_COF Enviada', color: '#06b6d4' },       // Cyan
    { name: 'COFs Assinadas', dataKey: 'Data_COF Assinada', color: '#38bdf8' },      // Sky
    { name: 'Vendas', dataKey: 'Data_Venda', color: '#10b981' },                     // Emerald
  ];

  const chartData = useMemo(() => {
    const weeklyData = {};
    const selectedMetric = metrics.find(m => m.name === activeMetric);

    if (!selectedMetric) return [];

    data.forEach(lead => {
      const dateStr = lead[selectedMetric.dataKey];
      if (dateStr) {
        const weekLabel = getSaturdayWeekLabel(dateStr);
        if (!weekLabel) return;

        if (!weeklyData[weekLabel]) {
          weeklyData[weekLabel] = { name: weekLabel, value: 0 };
        }
        weeklyData[weekLabel].value += 1;
      }
    });

    return Object.values(weeklyData).sort((a, b) => {
      const dateA = new Date(a.name.slice(0, 5).split('/').reverse().join('-'));
      const dateB = new Date(b.name.slice(0, 5).split('/').reverse().join('-'));
      return dateA - dateB;
    });
  }, [data, activeMetric]);

  return (
    // --- CORES DE FUNDO E TEXTO ATUALIZADAS ---
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-white">Evolução Semanal - Closer</h3>
        <div className="flex flex-wrap space-x-1 bg-gray-700 p-1 rounded-lg">
          {metrics.map(metric => (
            <button 
              key={metric.name}
              onClick={() => setActiveMetric(metric.name)} 
              // --- CORES DOS BOTÕES ATUALIZADAS ---
              className={`px-3 py-1 text-sm rounded-md transition-colors ${activeMetric === metric.name ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
              {metric.name}
            </button>
          ))}
        </div>
      </div>
      
      {chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Sem dados para a métrica "{activeMetric}" no período selecionado.</p>
      ) : (
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
            <Line 
              type="monotone" 
              dataKey="value" 
              name={activeMetric}
              stroke={metrics.find(m => m.name === activeMetric)?.color} 
              strokeWidth={2}
              dot={{ r: 4, fill: metrics.find(m => m.name === activeMetric)?.color }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CloserEvolutionChart;
