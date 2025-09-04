import React from 'react';

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

  const iconSize = small ? 24 : 32;

  // ALTERADO: Lógica para determinar o tamanho da fonte com base no comprimento do valor
  const getValueTextSize = () => {
    const valueLength = String(value).length;
    if (small) {
        return 'text-2xl'; // Mantém um tamanho fixo para cards pequenos
    }
    if (valueLength > 12) {
        return 'text-2xl'; // Tamanho menor para valores muito longos
    }
    if (valueLength > 9) {
        return 'text-3xl'; // Tamanho médio para valores longos
    }
    return 'text-4xl'; // Tamanho grande para valores normais
  };

  const valueTextSize = getValueTextSize();
  const titleTextSize = small ? 'text-xs' : 'text-sm';

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 h-full">
      {icon && (
        <div
          data-tooltip-id={tooltipText ? "kpi-tooltip" : undefined}
          data-tooltip-content={tooltipText ? tooltipText : undefined}
          data-tooltip-place="top"
          className={`${colorClasses[color]} bg-gray-700 p-3 rounded-lg self-start`}
        >
          {React.cloneElement(icon, { size: iconSize })}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-gray-400 uppercase ${titleTextSize}`}>{title}</h4>
        {/* Usamos a classe de tamanho de fonte dinâmica calculada acima */}
        <p className={`font-bold ${valueTextSize} text-white whitespace-nowrap`}>
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;

