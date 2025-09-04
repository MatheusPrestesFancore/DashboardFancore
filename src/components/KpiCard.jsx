import React from 'react';

// O ícone de 'Info' não é mais necessário aqui
// import { Info } from 'lucide-react'; 

const KpiCard = ({ title, value, unit, icon, color, small, tooltipText }) => {
  const colorClasses = {
    orange: 'text-orange-400',
    green: 'text-green-400',
    sky: 'text-sky-400',
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
  };

  // Ajustando tamanhos para combinar com o layout antigo
  const iconSize = small ? 24 : 32;
  const valueTextSize = small ? 'text-2xl' : 'text-4xl';
  const titleTextSize = small ? 'text-xs' : 'text-sm';

  return (
    // Layout principal revertido para flex-row com o ícone à esquerda
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
      {icon && (
        <div
          // O Tooltip agora é ativado a partir do contêiner do ícone principal
          data-tooltip-id={tooltipText ? "kpi-tooltip" : undefined}
          data-tooltip-content={tooltipText ? tooltipText : undefined}
          data-tooltip-place="top"
          className={`${colorClasses[color]} bg-gray-700 p-3 rounded-lg self-start`} // self-start para alinhar no topo
        >
          {React.cloneElement(icon, { size: iconSize })}
        </div>
      )}

      {/* Título e Valor empilhados verticalmente à direita */}
      <div>
        <h4 className={`font-medium text-gray-400 uppercase ${titleTextSize}`}>{title}</h4>
        <p className={`font-bold ${valueTextSize} text-white`}>
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;

