import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const LossReasonChart = ({ data }) => {
  const lossData = useMemo(() => {
    if (!data) return [];

    // 1. Filtra apenas os leads que foram perdidos e têm um motivo de perda
    const lostLeads = data.filter(lead => lead['Motivo_Perda'] && lead['Motivo_Perda'].trim() !== '');

    // 2. Conta a frequência de cada motivo de perda
    const reasonCounts = lostLeads.reduce((acc, lead) => {
      const reason = lead['Motivo_Perda'];
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

    // 3. Transforma o objeto de contagem em um array, ordena e pega os Top 10
    const sortedReasons = Object.entries(reasonCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count) // Ordena do maior para o menor
      .slice(0, 10); // Pega apenas os 10 principais motivos

    return sortedReasons;
  }, [data]);

  if (lossData.length === 0) {
    return null; // Não renderiza nada se não houver dados de perda
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Principais Motivos de Perda (Top 10)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical" // Gráfico de barras horizontais
          data={lossData}
          margin={{
            top: 5,
            right: 30,
            left: 100, // Aumenta a margem esquerda para caber os rótulos longos
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 12 }} allowDecimals={false} />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#9ca3af" 
            tick={{ fontSize: 12, fill: '#e5e7eb' }} 
            width={150} // Largura do eixo Y para os rótulos
            interval={0} // Garante que todos os rótulos sejam mostrados
          />
          <Tooltip 
            cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
          />
          <Bar dataKey="count" name="Quantidade" fill="#f97316">
             <LabelList dataKey="count" position="right" style={{ fill: 'white', fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LossReasonChart;