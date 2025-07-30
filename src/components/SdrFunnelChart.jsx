import React from 'react';

const SdrFunnelChart = ({ data }) => {
  const leads = data.length;
  const qualificados = data.filter(d => d['Data_Primeiro contato']).length;
  const agendados = data.filter(d => d['Data_Reunião agendada']).length;
  const realizados = data.filter(d => d['Data_Reunião realizada']).length;
  const vendas = data.filter(d => d['Data_Venda']).length;

  const funnelStages = [
    { name: 'Leads Captados', value: leads, color: 'bg-blue-500' },
    { name: 'Qualificados', value: qualificados, color: 'bg-cyan-500' },
    { name: 'Agendados', value: agendados, color: 'bg-purple-500' },
    { name: 'Realizados', value: realizados, color: 'bg-yellow-500' },
    { name: 'Vendas', value: vendas, color: 'bg-green-500' },
  ];

  const total = funnelStages[0].value;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Funil de Conversão SDR</h3>
      <div className="flex flex-col items-center">
        {funnelStages.map((stage, index) => {
          const percentage = total > 0 ? (stage.value / total) * 100 : 0;
          const widthPercentage = total > 0 ? (stage.value / total) * 100 : 0;

          if (stage.value === 0 && index > 0) return null; // Não mostra etapas vazias (exceto a primeira)

          return (
            <div
              key={stage.name}
              className={`relative ${stage.color} h-12 flex items-center justify-center text-white font-bold text-sm transition-all duration-300`}
              style={{
                width: `${Math.max(widthPercentage, 15)}%`, // Largura mínima para visibilidade
                clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
                marginTop: index > 0 ? '-10px' : '0',
              }}
            >
              <span>
                {stage.name}: {stage.value} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SdrFunnelChart;