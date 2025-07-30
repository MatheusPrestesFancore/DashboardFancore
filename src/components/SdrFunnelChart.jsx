import React from 'react';

const SdrFunnelChart = ({ data }) => {
  const leads = data.length;
  // Para o funil, vamos usar as mesmas contagens do dashboard
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
      <div className="space-y-2">
        {funnelStages.map((stage) => {
          const percentageOfTotal = total > 0 ? (stage.value / total) * 100 : 0;
          
          // Não mostra etapas com zero leads, a menos que seja a primeira
          if (stage.value === 0 && stage.name !== 'Leads Captados') return null;

          return (
            <div key={stage.name} className="flex items-center">
              <div className="w-1/3 text-right pr-4 text-gray-400 text-sm">{stage.name}</div>
              <div className="w-2/3">
                <div className="bg-gray-700 rounded-full h-6 relative">
                  <div
                    className={`${stage.color} h-6 rounded-full flex items-center justify-between px-3 text-white font-bold text-xs`}
                    style={{ width: `${percentageOfTotal}%` }}
                  >
                    <span>{stage.value}</span>
                    <span>{percentageOfTotal.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SdrFunnelChart;