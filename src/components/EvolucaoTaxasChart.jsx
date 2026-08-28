// src/components/EvolucaoTaxasChart.jsx
// CORRIGIDO: Usando os nomes corretos das chaves (ex: 'Qualificado X Leads')

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

// Definição de cores para o gráfico
const colors = {
  qualificadoXL: '#06b6d4', // Cyan
  agendadoXL: '#0ea5e9',    // Sky
  realizadoXAg: '#eab308',   // Yellow
  cofXVenda: '#22c55e',      // Green
  grid: 'rgba(107, 114, 128, 0.3)',
  text: '#9CA3AF',
  tooltipBg: 'rgb(31, 41, 55)',
  tooltipBorder: 'rgba(107, 114, 128, 0.5)'
};

// Tooltip customizado para o modo dark
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="p-3 rounded-md" 
        style={{ 
          backgroundColor: colors.tooltipBg, 
          border: `1px solid ${colors.tooltipBorder}` 
        }}
      >
        <p className="label text-white font-semibold">{label}</p>
        {payload.map(pld => (
          <p key={pld.dataKey} style={{ color: pld.color, fontWeight: 'bold' }}>
            {`${pld.name}: ${pld.value.toFixed(2)}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


const EvolucaoTaxasChart = ({ data }) => {

  // Função para converter "17,97%" ou "0,1797" para 17.97
  const parsePercent = (value) => {
    if (typeof value !== 'string') {
      return 0;
    }
    const cleanValue = value.replace(',', '.'); 
    const num = parseFloat(cleanValue) || 0;
    // Se o número for decimal (ex: 0.1797), multiplica por 100.
    if (num > 0 && num <= 1) {
      return num * 100;
    }
    return num; 
  };

  // Processa os dados usando as CHAVES CORRETAS
  const processedData = data.map((mes) => {
    return {
      'Mês': mes['Mês'],
      'Qualificado X L': parsePercent(mes['Qualificado X Leads']),    // Corrigido
      'Agendado X L': parsePercent(mes['Agendado X Leads']),      // Corrigido
      'Realizado X Ag': parsePercent(mes['Realizado X Agendado']), // Corrigido
      'COF assinada X Venda': parsePercent(mes['COF Assinada X Venda']), // Corrigido
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={processedData}
        margin={{
          top: 5,
          right: 20,
          left: 10, 
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        
        <XAxis 
          dataKey="Mês" 
          stroke={colors.text} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        
        <YAxis 
          stroke={colors.text} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          unit="%"
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Legend wrapperStyle={{ color: '#E5E7EB', paddingTop: '10px' }} />
        
        {/* As Linhas */}
        <Line 
          type="monotone" 
          name="Qualificado X Leads"
          dataKey="Qualificado X L" 
          stroke={colors.qualificadoXL} 
          strokeWidth={2} 
          activeDot={{ r: 6 }} 
          dot={false}
        />
        <Line 
          type="monotone" 
          name="Agendado X Leads"
          dataKey="Agendado X L" 
          stroke={colors.agendadoXL} 
          strokeWidth={2} 
          activeDot={{ r: 6 }} 
          dot={false}
        />
        <Line 
          type="monotone" 
          name="Realizado X Agend."
          dataKey="Realizado X Ag" 
          stroke={colors.realizadoXAg} 
          strokeWidth={2} 
          activeDot={{ r: 6 }} 
          dot={false}
        />
        <Line 
          type="monotone" 
          name="COF Assinada X Venda"
          dataKey="COF assinada X Venda" 
          stroke={colors.cofXVenda} 
          strokeWidth={2} 
          activeDot={{ r: 6 }} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucaoTaxasChart;

