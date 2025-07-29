import React from 'react';

const KpiCard = ({ title, value, icon, unit = '', color, small = false }) => (
  <div className={`bg-gray-800 p-4 rounded-lg shadow-lg flex ${small ? 'flex-col items-center text-center' : 'items-center space-x-4'}`}>
    {icon && <div className={`p-3 rounded-full bg-${color}-500 bg-opacity-20 ${small ? 'mb-2' : ''}`}>
      {React.cloneElement(icon, { className: `h-6 w-6 text-${color}-400` })}
    </div>}
    <div>
      <p className="text-gray-400 text-xs font-medium uppercase">{title}</p>
      <p className={`font-bold text-white ${small ? 'text-2xl' : 'text-3xl'}`}>{value}<span className="text-lg ml-1">{unit}</span></p>
    </div>
  </div>
);

export default KpiCard;
