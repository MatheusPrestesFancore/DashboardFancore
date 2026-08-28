import React from 'react';

const KpiCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color, 
  small, 
  tooltipText,
  tooltipPlace = 'top',
  tooltipOffset,
  tooltipClassName,
  pointerTooltip = false
}) => {
  const colorClasses = {
    orange: 'text-orange-500',
    green: 'text-green-500',
    green1: 'text-green-700',
    sky: 'text-sky-700',
    cyan: 'text-cyan-500',
    red: 'text-red-500',
    yellow: 'text-yellow-400',
    purple: 'text-purple-500',
    pink: 'text-pink-600',
    blue: 'text-blue-400',
    indigo: 'text-indigo-400',
    teal: 'text-teal-500',
  };

  const iconSize = small ? 24 : 32;

  const getValueTextSize = () => {
    const valueLength = String(value).length;

    if (small) {
      return 'text-2xl';
    }

    if (valueLength > 12) {
      return 'text-2xl';
    }

    if (valueLength > 9) {
      return 'text-3xl';
    }

    return 'text-4xl';
  };

  const valueTextSize = getValueTextSize();
  const titleTextSize = small ? 'text-xs' : 'text-sm';

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 h-full">
      {icon && (
        <div
          data-tooltip-id={tooltipText ? 'kpi-tooltip' : undefined}
          data-tooltip-content={tooltipText ? tooltipText : undefined}
          data-tooltip-place={tooltipPlace}
          data-tooltip-offset={tooltipOffset}
          data-tooltip-class-name={tooltipClassName}
          className={`${colorClasses[color] || 'text-gray-400'} bg-gray-700 p-3 rounded-lg self-start ${pointerTooltip ? 'cursor-pointer' : ''}`}
        >
          {React.cloneElement(icon, { size: iconSize })}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-gray-400 uppercase ${titleTextSize}`}>
          {title}
        </h4>

        <p className={`font-bold ${valueTextSize} text-white whitespace-nowrap`}>
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;