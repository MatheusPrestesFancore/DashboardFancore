import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const monthMap = {
  'jan.': { index: 0, name: 'Jan' }, 'fev.': { index: 1, name: 'Fev' }, 'mar.': { index: 2, name: 'Mar' },
  'abr.': { index: 3, name: 'Abr' }, 'mai.': { index: 4, name: 'Mai' }, 'jun.': { index: 5, name: 'Jun' },
  'jul.': { index: 6, name: 'Jul' }, 'ago.': { index: 7, name: 'Ago' }, 'set.': { index: 8, name: 'Set' },
  'out.': { index: 9, name: 'Out' }, 'nov.': { index: 10, name: 'Nov' }, 'dez.': { index: 11, name: 'Dez' },
};

// --- ALTERADO ---
// Removido 'Custo da Área' desta lista
const dropdownCostSourceOptions = [
    { id: '3P', label: 'Agência 3P' },
    { id: 'P9', label: 'Agência P9' },
    { id: 'Interno', label: 'Marketing Interno' },
];

const CacFilters = ({ filters, setFilters, availableMonths, availableChannels }) => {
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [firstSelection, setFirstSelection] = useState(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState(null);
  const [isCostSourceOpen, setIsCostSourceOpen] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  
  const costSourceRef = useRef(null);
  const channelRef = useRef(null);

  // --- ADICIONADO ---
  // Calcula a contagem de selecionados *apenas* do dropdown
  const selectedDropdownSourcesCount = useMemo(() => {
    return filters.costSources.filter(src => src !== 'Área').length;
  }, [filters.costSources]);

  const parseMonthStr = (monthStr) => {
    if (!monthStr || !monthStr.includes('/')) return null;
    const [month, year] = monthStr.split('/');
    return { month: month.toLowerCase(), year: parseInt(year, 10), original: monthStr };
  };
  
  const formatDate = (monthIndex, year) => {
    const monthKey = Object.keys(monthMap).find(key => monthMap[key].index === monthIndex);
    return `${monthKey}/${year}`;
  };

  const uniqueYears = useMemo(() => {
    const years = new Set(availableMonths.map(m => parseMonthStr(m)?.year).filter(Boolean));
    return Array.from(years).sort((a, b) => a - b);
  }, [availableMonths]);

  useEffect(() => {
    if (uniqueYears.length > 0) {
      setDisplayYear(uniqueYears[uniqueYears.length - 1]);
    }
  }, [uniqueYears]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (costSourceRef.current && !costSourceRef.current.contains(event.target)) {
        setIsCostSourceOpen(false);
      }
      if (channelRef.current && !channelRef.current.contains(event.target)) {
        setIsChannelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const start = parseMonthStr(filters.startMonth);
    const end = parseMonthStr(filters.endMonth);
    if (!start || !end || start.year !== end.year || start.year !== displayYear) {
      setActiveQuickFilter(null); return;
    }
    const startIdx = monthMap[start.month]?.index;
    const endIdx = monthMap[end.month]?.index;
    if (startIdx === 0 && endIdx === 2) setActiveQuickFilter('q1');
    else if (startIdx === 3 && endIdx === 5) setActiveQuickFilter('q2');
    else if (startIdx === 6 && endIdx === 8) setActiveQuickFilter('q3');
    else if (startIdx === 9 && endIdx === 11) setActiveQuickFilter('q4');
    else {
      const yearMonths = availableMonths.filter(m => m.endsWith(`/${displayYear}`));
      if (yearMonths.length > 0 && filters.startMonth === yearMonths[0] && filters.endMonth === yearMonths[yearMonths.length - 1]) {
        setActiveQuickFilter('year');
      } else { setActiveQuickFilter(null); }
    }
  }, [filters, displayYear, availableMonths]);
  
  const handleYearChange = (direction) => {
    const currentIndex = uniqueYears.indexOf(displayYear);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < uniqueYears.length) {
      setDisplayYear(uniqueYears[newIndex]);
    }
  };

  const handleMonthClick = (monthIndex) => {
    const clickedMonthStr = formatDate(monthIndex, displayYear);
    if (!availableMonths.includes(clickedMonthStr)) return;
    if (!firstSelection) {
      setFirstSelection(clickedMonthStr);
      setFilters(prev => ({...prev, startMonth: clickedMonthStr, endMonth: clickedMonthStr }));
    } else {
      const allDates = [firstSelection, clickedMonthStr].sort((a, b) => {
        const dateA = parseMonthStr(a);
        const dateB = parseMonthStr(b);
        if (!dateA || !dateB) return 0;
        if (dateA.year !== dateB.year) return dateA.year - dateB.year;
        return monthMap[dateA.month].index - monthMap[dateB.month].index;
      });
      setFilters(prev => ({...prev, startMonth: allDates[0], endMonth: allDates[1] }));
      setFirstSelection(null);
    }
  };

  const handleQuarterClick = (quarter) => {
    const quarters = {
      1: { start: 0, end: 2 }, 2: { start: 3, end: 5 },
      3: { start: 6, end: 8 }, 4: { start: 9, end: 11 },
    };
    const startMonth = formatDate(quarters[quarter].start, displayYear);
    const endMonth = formatDate(quarters[quarter].end, displayYear);

    if (availableMonths.includes(startMonth) && availableMonths.includes(endMonth)) {
        setFilters(prev => ({...prev, startMonth, endMonth }));
        setFirstSelection(null);
    }
  };

  const handleFullYearClick = () => {
      const yearMonths = availableMonths.filter(m => m.endsWith(`/${displayYear}`)).sort((a,b) => {
          const dateA = parseMonthStr(a); const dateB = parseMonthStr(b);
          if (!dateA || !dateB) return 0;
          return monthMap[dateA.month].index - monthMap[dateB.month].index;
      });
      if (yearMonths.length > 0) {
          setFilters(prev => ({...prev, startMonth: yearMonths[0], endMonth: yearMonths[yearMonths.length - 1] }));
          setFirstSelection(null);
      }
  };
  
  const handleChannelChange = (event) => {
    const { value, checked } = event.target;
    
    setFilters(prev => {
      const currentChannels = prev.channels;
      let newChannels;

      if (value === 'Todos') {
        newChannels = ['Todos'];
      } else {
        const filteredChannels = currentChannels.filter(c => c !== 'Todos');
        if (checked) {
          newChannels = [...filteredChannels, value];
        } else {
          newChannels = filteredChannels.filter(c => c !== value);
        }
      }
      
      if (newChannels.length === 0) {
        newChannels = ['Todos'];
      }
      
      return { ...prev, channels: newChannels };
    });
  };

  // --- MANTIDO ---
  // Esta função genérica funciona perfeitamente para o novo checkbox também
  const handleCostSourceChange = (event) => {
    const { value, checked } = event.target;
    setFilters(prevFilters => {
        const currentSources = prevFilters.costSources;
        if (checked) {
            return { ...prevFilters, costSources: [...currentSources, value] };
        } else {
            return { ...prevFilters, costSources: currentSources.filter(source => source !== value) };
        }
    });
  };

  const selectedStart = parseMonthStr(filters.startMonth);
  const selectedEnd = parseMonthStr(filters.endMonth);

  const quickFilterClasses = (filterName) => {
    let base = "px-3 py-1 text-xs rounded-md transition-all duration-150 ";
    if (activeQuickFilter === filterName) {
      return base + "bg-orange-500 text-white font-bold ring-2 ring-orange-400 ring-offset-2 ring-offset-gray-800";
    }
    return base + "bg-gray-700 hover:bg-orange-500";
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      {/* --- INÍCIO DAS ALTERAÇÕES NO JSX ---
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 pb-4 border-b border-gray-700">
        <div className="relative" ref={channelRef}>
          <label className="block text-sm font-medium text-gray-300 mb-1">Canal de Origem</label>
          <button type="button" onClick={() => setIsChannelOpen(!isChannelOpen)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white flex justify-between items-center text-left">
            <span className="truncate">
              {filters.channels.includes('Todos') ? 'Todos' : `${filters.channels.length} selecionado(s)`}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isChannelOpen ? 'transform rotate-180' : ''}`} />
          </button>
          {isChannelOpen && (
            <div className="absolute z-20 top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg p-2 max-h-60 overflow-y-auto">
              {availableChannels.map(channel => (
                <label key={channel} className="flex items-center space-x-3 text-sm p-2 hover:bg-gray-600 rounded cursor-pointer">
                  <input type="checkbox" value={channel}
                    checked={filters.channels.includes(channel)}
                    onChange={handleChannelChange}
                    className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-orange-500 focus:ring-orange-500 cursor-pointer" />
                  <span>{channel}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        {/* Bloco de Fontes de Custo modificado */}
        <div> {/* Adicionado um 'div' pai para agrupar o dropdown e o novo checkbox */}
          <div className="relative" ref={costSourceRef}>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fontes de Custo (Agências/Interno)</label>
            <button type="button" onClick={() => setIsCostSourceOpen(!isCostSourceOpen)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white flex justify-between items-center text-left">
              <span className="truncate">
                {/* Alterado para usar a nova contagem 'selectedDropdownSourcesCount' */}
                {selectedDropdownSourcesCount === 0 ? 'Nenhuma' : `${selectedDropdownSourcesCount} selecionada(s)`}
              </span>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isCostSourceOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isCostSourceOpen && (
              <div className="absolute z-10 top-full mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg p-2">
                {/* Alterado para mapear 'dropdownCostSourceOptions' */}
                {dropdownCostSourceOptions.map(source => (
                  <label key={source.id} className="flex items-center space-x-3 text-sm p-2 hover:bg-gray-600 rounded cursor-pointer">
                    <input type="checkbox" name="costSources" value={source.id}
                      checked={filters.costSources.includes(source.id)}
                      onChange={handleCostSourceChange}
                      className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-orange-500 focus:ring-orange-500 cursor-pointer" />
                    <span>{source.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* --- CHECKBOX DE CUSTO DE ÁREA ADICIONADO --- */}
          <div className="mt-3"> {/* Adiciona espaço do dropdown acima */}
            <label className="flex items-center space-x-2 cursor-pointer p-1 w-fit">
              <input 
                type="checkbox" 
                name="costSources" 
                value="Área"
                checked={filters.costSources.includes('Área')}
                onChange={handleCostSourceChange}
                className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <span className="text-gray-300 text-sm font-medium">Incluir Custo da Área</span>
            </label>
          </div>
        </div>
      </div>
      {/* --- FIM DAS ALTERAÇÕES NO JSX ---
      */}

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <span className="text-sm font-medium text-gray-300 mr-2">Filtros Rápidos ({displayYear}):</span>
        <button onClick={() => handleQuarterClick(1)} className={quickFilterClasses('q1')}>1º Tri</button>
        <button onClick={() => handleQuarterClick(2)} className={quickFilterClasses('q2')}>2º Tri</button>
        <button onClick={() => handleQuarterClick(3)} className={quickFilterClasses('q3')}>3º Tri</button>
        <button onClick={() => handleQuarterClick(4)} className={quickFilterClasses('q4')}>4º Tri</button>
        <button onClick={handleFullYearClick} className={quickFilterClasses('year')}>Ano Todo</button>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-4">
        <button onClick={() => handleYearChange(-1)} disabled={!uniqueYears.length || displayYear <= uniqueYears[0]} className="p-1 rounded-full disabled:opacity-30 hover:bg-gray-700">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className="text-lg font-semibold w-24 text-center">{displayYear}</div>
        <button onClick={() => handleYearChange(1)} disabled={!uniqueYears.length || displayYear >= uniqueYears[uniqueYears.length - 1]} className="p-1 rounded-full disabled:opacity-30 hover:bg-gray-700">
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {Object.values(monthMap).sort((a,b) => a.index - b.index).map(({ index, name }) => {
          const currentMonthStr = formatDate(index, displayYear);
          const isAvailable = availableMonths.includes(currentMonthStr);
          let inRange = false;
          if (selectedStart && selectedEnd) {
              const startTime = selectedStart.year * 12 + monthMap[selectedStart.month].index;
              const endTime = selectedEnd.year * 12 + monthMap[selectedEnd.month].index;
              const parsedCurrent = parseMonthStr(currentMonthStr);
              if(parsedCurrent){
                const currentMonthMeta = monthMap[parsedCurrent.month];
                if (currentMonthMeta) {
                    const currentTime = parsedCurrent.year * 12 + currentMonthMeta.index;
                    inRange = currentTime >= startTime && currentTime <= endTime;
                }
              }
          }
          const isSelected = filters.startMonth === currentMonthStr || filters.endMonth === currentMonthStr;
          const isFirstSelection = firstSelection === currentMonthStr;
          let classes = "p-2 text-center rounded-lg transition-colors duration-150 ";
          if (isAvailable) {
            if (isSelected || isFirstSelection) classes += "bg-orange-500 text-white font-bold";
            else if (inRange) classes += "bg-orange-500 bg-opacity-40 text-white";
            else classes += "bg-gray-700 border border-gray-600 hover:bg-gray-600 cursor-pointer";
          } else {
            classes += "text-gray-600 cursor-not-allowed";
          }
          return (<div key={index} onClick={() => handleMonthClick(index)} className={classes}>{name}</div>);
        })}
      </div>
    </div>
  );
};

export default CacFilters;