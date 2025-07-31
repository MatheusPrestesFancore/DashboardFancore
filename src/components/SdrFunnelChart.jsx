import React from 'react';
import { QUALIFIED_STAGES } from '../utils/helpers';

const SdrFunnelChart = ({ data }) => {
  const leads = data.length;
  const qualificados = data.filter(lead => QUALIFIED_STAGES.some(stage => lead[stage])).length;
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
      <h3 className="text-lg font-semibold text-white mb-6">Funil de Conversão</h3>
      <div className="flex flex-col items-center space-y-[-16px]"> {/* Overlap para efeito 3D */}
        {funnelStages.map((stage, index) => {
          if (total === 0) return null;
          
          const widthPercentage = (stage.value / total) * 100;
          
          if (stage.value === 0 && index > 0) return null;

          return (
            <div
              key={stage.name}
              className={`relative ${stage.color} h-16 flex items-center justify-center text-white font-bold text-sm transition-all duration-300 shadow-md`}
              style={{
                width: `${Math.max(widthPercentage, 25)}%`, // Largura mínima de 25%
                minWidth: '150px', // Largura mínima em pixels para garantir espaço
                clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
              }}
            >
              <div className="text-center">
                <div>{stage.name}</div>
                <div className="text-xs opacity-80 font-normal">
                  {stage.value} ({((stage.value / total) * 100).toFixed(1)}%)
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