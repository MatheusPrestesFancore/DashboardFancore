// src/components/EvolucaoMensalChart.jsx
// VERSÃO CORRIGIDA - Usando Recharts (conforme seu import)

import React from 'react';
// Apenas imports do Recharts
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

// Rascunho de cores para o tema dark (baseado nos KpiCards)
const colors = {
  leads: '#f97316',       // Laranja
  qualificados: '#06b6d4',  // Cyan
  vendas: '#22c55e',     // Verde
  grid: 'rgba(107, 114, 128, 0.3)', // Cor da grade (cinza)
  text: '#9CA3AF',        // Cor do texto (cinza)
  tooltipBg: 'rgb(31, 41, 55)', // Cor de fundo do Tooltip (gray-800)
  tooltipBorder: 'rgba(107, 114, 128, 0.5)'
};

const EvolucaoMensalChart = ({ data }) => {
  // O Recharts aceita o array de dados diretamente, 
  // não precisamos formatar 'labels' e 'datasets' separados.
  
  // Precisamos converter os valores para números, 
  // pois o Recharts espera números para o eixo Y.
  const processedData = data.map(mes => ({
    ...mes,
    Leads: Number(mes.Leads) || 0,
    Qualificado: Number(mes.Qualificado) || 0,
    Venda: Number(mes.Venda) || 0,
  }));

  return (
    // ResponsiveContainer é essencial para o gráfico 
    // preencher o 'div' pai (que definimos com height: 300px)
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={processedData}
        margin={{
          top: 5,
          right: 20,
          left: 0,
          bottom: 5,
        }}
      >
        {/* Grade com cor adaptada ao dark mode */}
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        
        {/* Eixo X (Mês) */}
        <XAxis 
          dataKey="Mês" 
          stroke={colors.text} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        
        {/* Eixo Y (Valores) */}
        <YAxis 
          stroke={colors.text} 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        
        {/* Tooltip (Hover) com estilo dark mode */}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: colors.tooltipBg, 
            borderColor: colors.tooltipBorder
          }} 
          labelStyle={{ color: '#fff' }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        
        {/* Legenda */}
        <Legend wrapperStyle={{ color: '#E5E7EB', paddingTop: '10px' }} />
        
        {/* As Linhas */}
        <Line 
          type="monotone" 
          dataKey="Leads" 
          stroke={colors.leads} 
          strokeWidth={2} 
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Qualificado" 
          stroke={colors.qualificados} 
          strokeWidth={2} 
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Venda" 
          stroke={colors.vendas} 
          strokeWidth={2} 
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EvolucaoMensalChart;
