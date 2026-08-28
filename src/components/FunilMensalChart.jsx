// src/components/FunilMensalChart.jsx
// CORRIGIDO: Voltando a proporção de altura anterior (visualValue 20, 16, 14...)
// MUDANÇA: Removido o CustomLabel complexo. Usando labels "default" DENTRO do funil.

import React from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from 'recharts';

// Componente para o Tooltip customizado (para visual dark)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-700 text-white p-3 rounded-lg shadow-lg border border-gray-600">
        <p className="font-bold text-lg">{data.name}</p>
        <p className="text-sm">Valor: {data.realValue.toLocaleString('pt-BR')}</p>
        <p className="text-sm">Conversão: {data.conversion}%</p>
      </div>
    );
  }
  return null;
};

// --- NOVO LABEL SIMPLES (PARA FICAR DENTRO DO FUNIL) ---
const SimpleCustomLabel = (props) => {
  const { x, y, width, height, index, data } = props;
  const item = data[index];

  if (!item || item.name === undefined || item.conversion === undefined) {
    return null;
  }

  const isFirstStep = index === 0;

  // Se a altura do segmento for muito pequena, não mostra o label
  if (height < 25) {
    return null;
  }

  return (
    <g>
      {/* Nome da Etapa e Valor */}
      <text
        x={x + width / 2} // Centralizado horizontalmente
        y={y + height / 2 - (isFirstStep ? 0 : 8)} // Centralizado (ou um pouco acima se tiver %)
        fill="#FFFFFF"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-bold text-md drop-shadow-md"
      >
        {item.name} ({item.realValue.toLocaleString('pt-BR')})
      </text>

      {/* Porcentagem (exceto para Leads) */}
      {!isFirstStep && (
        <text
          x={x + width / 2} // Centralizado horizontalmente
          y={y + height / 2 + 10} // Um pouco abaixo do nome
          fill="#E5E7EB"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm drop-shadow-md"
        >
          {item.conversion}%
        </text>
      )}
    </g>
  );
};


const FunilMensalChart = ({ selectedMonthData }) => {
  if (!selectedMonthData) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500">Selecione um mês para ver o funil.</p>
      </div>
    );
  }

  // 1. Valores Reais
  const leads = parseInt(selectedMonthData.Leads || 0, 10);
  const qualificados = parseInt(selectedMonthData.Qualificado || 0, 10);
  const agendamentos = parseInt(selectedMonthData.Agendamento || 0, 10);
  const realizados = parseInt(selectedMonthData.Realizado || 0, 10);
  const cofAssinada = parseInt(selectedMonthData['COF assinada'] || 0, 10);
  const vendas = parseInt(selectedMonthData.Venda || selectedMonthData['Total de vendas'] || 0, 10);

  // 2. Taxas de Conversão
  const txQualificadoVsLeads = leads > 0 ? ((qualificados / leads) * 100).toFixed(0) : 0;
  const txAgendadoVsQualificado = qualificados > 0 ? ((agendamentos / qualificados) * 100).toFixed(0) : 0;
  const txRealizadoVsAgendado = agendamentos > 0 ? ((realizados / agendamentos) * 100).toFixed(0) : 0;
  const txCofVsRealizado = realizados > 0 ? ((cofAssinada / realizados) * 100).toFixed(0) : 0;
  const txVendaVsCof = cofAssinada > 0 ? ((vendas / cofAssinada) * 100).toFixed(0) : 0;

  // 3. Dados para o Gráfico (COM "visualValue" para altura)
  // Voltando para os valores proporcionais que você gostou
  const data = [
    { name: 'Leads', visualValue: 16, realValue: leads, conversion: 100, fill: '#16A34A' },
    //{ name: 'Qualificados', visualValue: 16, realValue: qualificados, conversion: txQualificadoVsLeads, fill: '#22C55E' }, 
    { name: 'MQL', visualValue: 14, realValue: agendamentos, conversion: txAgendadoVsQualificado, fill: '#3B82F6' },
    { name: 'SQL', visualValue: 12, realValue: realizados, conversion: txRealizadoVsAgendado, fill: '#F97316' },
    //{ name: 'COF Assinada', visualValue: 10, realValue: cofAssinada, conversion: txCofVsRealizado, fill: '#EAB308' }, 
    { name: 'Vendas', visualValue: 8, realValue: vendas, conversion: txVendaVsCof, fill: '#EC4899' },
  ];

  return (
    <ResponsiveContainer width="100%" height={450}>
      {/* Removido a 'margin' para deixar o gráfico centralizar por padrão */}
      <FunnelChart>
        <Tooltip content={<CustomTooltip />} />
        <Funnel
          dataKey="visualValue"
          data={data}
          isAnimationActive
          labelLine={false}
          trapezoid
          ratio={0.8}
          spacing={2}
        >
          <LabelList
            data={data}
            // Posição 'center' é o default, mas sendo explícito
            position="center"
            content={<SimpleCustomLabel data={data} />}
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};

export default FunilMensalChart;

