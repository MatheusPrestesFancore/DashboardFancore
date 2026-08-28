// src/components/FunilMonthFilter.jsx
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const monthMap = {
  'Janeiro': { index: 0, name: 'Jan' },
  'Fevereiro': { index: 1, name: 'Fev' },
  'Março': { index: 2, name: 'Mar' },
  'Abril': { index: 3, name: 'Abr' },
  'Maio': { index: 4, name: 'Mai' },
  'Junho': { index: 5, name: 'Jun' },
  'Julho': { index: 6, name: 'Jul' },
  'Agosto': { index: 7, name: 'Ago' },
  'Setembro': { index: 8, name: 'Set' },
  'Outubro': { index: 9, name: 'Out' },
  'Novembro': { index: 10, name: 'Nov' },
  'Dezembro': { index: 11, name: 'Dez' }
};

const monthOrder = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const FunilMonthFilter = ({
  availableMonths,
  selectedPeriodType,
  setSelectedPeriodType,
  selectedPeriodValue,
  setSelectedPeriodValue,
  selectedYear,
  setSelectedYear,
  uniqueYears,
  startMonth,
  setStartMonth,
  endMonth,
  setEndMonth,
  firstSelection,
  setFirstSelection
}) => {
  
  const handleYearChange = (direction) => {
    const currentIndex = uniqueYears.indexOf(selectedYear);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < uniqueYears.length) {
      setSelectedYear(uniqueYears[newIndex]);
    }
  };

  const handleMonthClick = (monthName) => {
    if (!availableMonths.includes(monthName)) return;

    if (!firstSelection) {
      // First click: start a manual selection range
      setFirstSelection(monthName);
      setSelectedPeriodType('custom');
      setSelectedPeriodValue(null);
      setStartMonth(monthName);
      setEndMonth(monthName);
    } else {
      // Second click: complete the selection range
      const startIndex = monthOrder.indexOf(firstSelection);
      const endIndex = monthOrder.indexOf(monthName);
      
      if (startIndex <= endIndex) {
        setStartMonth(firstSelection);
        setEndMonth(monthName);
      } else {
        setStartMonth(monthName);
        setEndMonth(firstSelection);
      }
      setFirstSelection(null);
      setSelectedPeriodType('custom');
      setSelectedPeriodValue(null);
    }
  };

  const handleQuarterClick = (quarter) => {
    const { start, end } = {
      1: { start: 'Janeiro', end: 'Março' },
      2: { start: 'Abril', end: 'Junho' },
      3: { start: 'Julho', end: 'Setembro' },
      4: { start: 'Outubro', end: 'Dezembro' }
    }[quarter];

    setSelectedPeriodType('quarter');
    setSelectedPeriodValue(quarter);
    setStartMonth(start);
    setEndMonth(end);
    setFirstSelection(null);
  };

  const handleFullYearClick = () => {
    setSelectedPeriodType('year');
    setSelectedPeriodValue('all');
    
    if (availableMonths.length > 0) {
      const sortedAvailable = [...availableMonths].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
      setStartMonth(sortedAvailable[0]);
      setEndMonth(sortedAvailable[sortedAvailable.length - 1]);
    } else {
      setStartMonth('Janeiro');
      setEndMonth('Dezembro');
    }
    setFirstSelection(null);
  };

  const getQuickFilterClass = (isActive) => {
    let base = "px-3 py-1 text-xs rounded-md transition-all duration-150 text-white font-medium ";
    if (isActive) {
      return base + "bg-orange-500 font-bold ring-2 ring-orange-400 ring-offset-2 ring-offset-gray-800";
    }
    return base + "bg-gray-700 hover:bg-orange-500 cursor-pointer";
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      {/* Filtros Rápidos */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <span className="text-sm font-medium text-gray-300 mr-2">Filtros Rápidos ({selectedYear}):</span>
        <button 
          type="button"
          onClick={() => handleQuarterClick(1)} 
          className={getQuickFilterClass(selectedPeriodType === 'quarter' && selectedPeriodValue === 1)}
        >
          1º Tri
        </button>
        <button 
          type="button"
          onClick={() => handleQuarterClick(2)} 
          className={getQuickFilterClass(selectedPeriodType === 'quarter' && selectedPeriodValue === 2)}
        >
          2º Tri
        </button>
        <button 
          type="button"
          onClick={() => handleQuarterClick(3)} 
          className={getQuickFilterClass(selectedPeriodType === 'quarter' && selectedPeriodValue === 3)}
        >
          3º Tri
        </button>
        <button 
          type="button"
          onClick={() => handleQuarterClick(4)} 
          className={getQuickFilterClass(selectedPeriodType === 'quarter' && selectedPeriodValue === 4)}
        >
          4º Tri
        </button>
        <button 
          type="button"
          onClick={handleFullYearClick} 
          className={getQuickFilterClass(selectedPeriodType === 'year')}
        >
          Ano Todo
        </button>
      </div>

      {/* Seletor de Ano */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button 
          type="button"
          onClick={() => handleYearChange(-1)} 
          disabled={!uniqueYears.length || selectedYear <= uniqueYears[0]} 
          className="p-1 rounded-full disabled:opacity-30 hover:bg-gray-700 text-white transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className="text-lg font-semibold w-24 text-center text-white">{selectedYear}</div>
        <button 
          type="button"
          onClick={() => handleYearChange(1)} 
          disabled={!uniqueYears.length || selectedYear >= uniqueYears[uniqueYears.length - 1]} 
          className="p-1 rounded-full disabled:opacity-30 hover:bg-gray-700 text-white transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Grid de Meses */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {monthOrder.map((monthName) => {
          const { name } = monthMap[monthName];
          const isAvailable = availableMonths.includes(monthName);
          
          const startIndex = monthOrder.indexOf(startMonth);
          const endIndex = monthOrder.indexOf(endMonth);
          const currentIndex = monthOrder.indexOf(monthName);
          
          const isBoundary = monthName === startMonth || monthName === endMonth || monthName === firstSelection;
          const inRange = startIndex !== -1 && endIndex !== -1 && currentIndex >= startIndex && currentIndex <= endIndex;

          let classes = "py-2.5 px-2 text-center rounded-lg transition-colors duration-150 text-sm font-semibold focus:outline-none ";
          
          if (isAvailable) {
            if (isBoundary) {
              classes += "bg-orange-500 text-white font-bold cursor-pointer";
            } else if (inRange) {
              classes += "bg-orange-500 bg-opacity-40 text-white cursor-pointer";
            } else {
              classes += "bg-gray-700 border border-gray-600 hover:bg-gray-600 cursor-pointer text-white";
            }
          } else {
            classes += "text-gray-600 cursor-not-allowed bg-gray-800/50 border border-gray-700/50";
          }

          return (
            <button
              key={monthName}
              type="button"
              onClick={() => handleMonthClick(monthName)}
              className={classes}
              disabled={!isAvailable}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FunilMonthFilter;