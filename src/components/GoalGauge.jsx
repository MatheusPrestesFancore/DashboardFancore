import React from 'react';

const GoalGauge = ({ title, value, goal, color }) => {
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const rotation = (percentage / 100) * 180;

  const colorClasses = {
    purple: 'text-purple-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    cyan: 'text-cyan-400',
  };

  return (
    <div className="bg-gray-700/50 p-4 rounded-lg text-center flex flex-col items-center">
      <h4 className="text-sm font-medium text-gray-400 uppercase mb-2">{title}</h4>
      <div className="relative w-40 h-20 overflow-hidden mb-2">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-600 rounded-t-full border-b-0"></div>
        <div
          className="absolute top-0 left-0 w-full h-full border-8 rounded-t-full border-b-0 transition-transform duration-500"
          style={{
            borderColor: `var(--tw-color-${color}-400)`,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'bottom center',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
          }}
        ></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-gray-800 rounded-t"></div>
      </div>
      {/* **CORREÇÃO APLICADA AQUI** */}
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>
        {Number(value).toFixed(2)}
        <span className="text-lg">%</span>
      </p>
      <p className="text-xs text-gray-500">Meta: {goal}%</p>
    </div>
  );
};

export default GoalGauge;