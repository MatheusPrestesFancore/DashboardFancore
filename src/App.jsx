// src/App.jsx

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardFilters from './components/DashboardFilters';
import AutomationDashboard from './pages/AutomationDashboard';
import SdrPerformanceDashboard from './pages/SdrPerformanceDashboard';
import CloserPerformanceDashboard from './pages/CloserPerformanceDashboard';
import FunilDeVendasDashboard from './pages/FunilDeVendasDashboard';
import RankingSdrDashboard from './pages/RankingSdrDashboard';
import CacAnalysisDashboard from './pages/CacAnalysisDashboard';
// NOVO: Importe a nova página do mapa
import MapaVendasDashboard from './pages/MapaVendasDashboard';

// URLs das planilhas
const GOOGLE_SHEET_LEADS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=1495728090&single=true&output=csv';
const GOOGLE_SHEET_GOALS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=515919224&single=true&output=csv';
const GOOGLE_SHEET_CAC_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=855119221&single=true&output=csv';
// NOVO: Adicione a URL da sua nova planilha/aba de mapa aqui
const GOOGLE_SHEET_MAP_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=469774215&single=true&output=csv';


const initialFiltersState = {
  responsavel: 'Todos',
  etapa: 'Todos',
  startDate: '',
  endDate: '',
  origem: 'Todas',
  dateFilterType: 'custom_created_date', 
};

export default function App() {
  const [allData, setAllData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [cacData, setCacData] = useState([]);
  // NOVO: Estado para armazenar os dados do mapa
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('cac');
  const [filters, setFilters] = useState(initialFiltersState); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setFilters(initialFiltersState);
  };

  useEffect(() => {
    const parseCsv = (csvText, dataType = 'leads') => {
        if (!csvText) return [];
        const parseCsvLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (const char of line) {
                if (char === '"' && !inQuotes) { inQuotes = true; } 
                else if (char === '"' && inQuotes) { inQuotes = false; } 
                else if (char === ',' && !inQuotes) { result.push(current); current = ''; } 
                else { current += char; }
            }
            result.push(current);
            return result;
        };
        const lines = csvText.trim().split(/\r?\n/);
        const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
        const parseCurrency = (value) => {
            if (typeof value !== 'string' || !value) return 0;
            const cleaned = value.replace(/R\$\s?|\./g, '').replace(',', '.');
            return parseFloat(cleaned) || 0;
        };
        const parseIntValue = (value) => {
            if (typeof value !== 'string' || !value) return 0;
            const cleaned = value.replace(/^"|"$/g, '');
            return parseInt(cleaned, 10) || 0;
        };
        
        return lines.slice(1).map(line => {
            const values = parseCsvLine(line);
            const obj = headers.reduce((acc, header, index) => {
                acc[header] = values[index] ? values[index].trim() : '';
                return acc;
            }, {});

            // Lógica de parsing baseada no tipo de dado
            if (dataType === 'cac') {
                return {
                    month: obj['Mês/Ano'],
                    investment_total: parseCurrency(obj['Investimento Total']),
                    investment_marketing: parseCurrency(obj['Investimento Marketing']),
                    leads: parseIntValue(obj['Total de Leads']),
                    sales: parseIntValue(obj['Total de Vendas']),
                    revenue: parseCurrency(obj['Receita Total']),
                    cpl: parseCurrency(obj['CPL (Custo/Lead)']),
                    cac: parseCurrency(obj['CAC (Custo/Cliente)']),
                };
            }

            if (dataType === 'map') {
                return {
                    id: obj['id'],
                    city: obj['cidade'],
                    state: obj['estado'],
                    status: obj['status'],
                    lat: parseFloat(obj['latitude']),
                    lng: parseFloat(obj['longitude']),
                };
            }
            
            // Retorno padrão para 'leads' e 'goals'
            return obj;
        }).filter(row => row && Object.values(row).some(val => val !== null && val !== ''));
    };
    
    Promise.all([
        fetch(GOOGLE_SHEET_LEADS_CSV_URL).then(res => res.ok ? res.text() : ''),
        fetch(GOOGLE_SHEET_GOALS_CSV_URL).then(res => res.ok ? res.text() : ''),
        fetch(GOOGLE_SHEET_CAC_CSV_URL).then(res => res.ok ? res.text() : ''),
        // NOVO: Fetch para os dados do mapa
        fetch(GOOGLE_SHEET_MAP_CSV_URL).then(res => res.ok ? res.text() : '')
    ]).then(([leadsCsv, goalsCsv, cacCsv, mapCsv]) => {
        setAllData(parseCsv(leadsCsv, 'leads'));
        setGoalsData(parseCsv(goalsCsv, 'goals'));
        setCacData(parseCsv(cacCsv, 'cac'));
        // NOVO: Seta o estado com os dados do mapa parseados
        setMapData(parseCsv(mapCsv, 'map'));
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setError('Falha ao carregar os dados das planilhas.');
        setLoading(false);
    });
  }, []);

  const origens = useMemo(() => {
    const tags = new Set();
    allData.forEach(lead => {
      const match = lead.Nome_Lead?.match(/\[(.*?)\]/);
      if (match && match[1]) {
        tags.add(match[1]);
      }
    });
    return ['Todas', ...Array.from(tags)];
  }, [allData]);
  
  const filteredData = useMemo(() => {
    const parseDate = (dateString) => {
      if (!dateString || typeof dateString !== 'string') return null;
      const parts = dateString.split(' ')[0].split('/');
      if (parts.length !== 3) return null;
      return new Date(parts[2], parts[1] - 1, parts[0]);
    };
    let data = allData;
    if (filters.responsavel !== 'Todos') {
      let key = 'Responsável';
      if (activePage === 'sdr') key = 'Responsável SDR';
      if (activePage === 'closer') key = 'Responsável Closer';
      data = data.filter(d => d[key] === filters.responsavel);
    }
    if (filters.etapa !== 'Todos' && !['sdr', 'closer', 'cac'].includes(activePage)) {
      data = data.filter(d => d['Etapa Atual'] === filters.etapa);
    }
    if (filters.origem !== 'Todas') {
      data = data.filter(d => d.Nome_Lead?.includes(`[${filters.origem}]`));
    }
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      data = data.filter(d => {
        if (filters.dateFilterType === 'any_activity') {
          const datasParaChecar = [
            d['Data_Criacao'], d['won_time'], d['lost_time'], d['update_time'],
          ].map(parseDate);
          return datasParaChecar.some(date => date && date >= startDate && date <= endDate);
        } else {
          const columnName = filters.dateFilterType === 'custom_created_date' ? 'Data_Criacao' : filters.dateFilterType;
          const leadDate = parseDate(d[columnName]);
          return leadDate && leadDate >= startDate && leadDate <= endDate;
        }
      });
    }
    return data;
  }, [allData, filters, activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'automation': return <AutomationDashboard data={filteredData} />;
      case 'funil': return <FunilDeVendasDashboard data={filteredData} goals={goalsData} />;
      case 'sdr': return <SdrPerformanceDashboard data={filteredData} />;
      case 'closer': return <CloserPerformanceDashboard data={filteredData} />;
      case 'ranking': return <RankingSdrDashboard allData={allData} filters={filters} />;
      case 'cac': return <CacAnalysisDashboard data={cacData} />;
      // NOVO: Renderiza a página do mapa com os dados corretos
      case 'map': return <MapaVendasDashboard data={mapData} />;
      default: return <AutomationDashboard data={filteredData} />;
    }
  };
  
  const getPageTitle = () => {
    switch (activePage) {
        case 'automation': return 'Dashboard de Automação';
        case 'funil': return 'Dashboard Funil de Vendas';
        case 'sdr': return 'Dashboard de Performance SDR';
        case 'closer': return 'Dashboard de Performance Closer';
        case 'ranking': return 'Ranking de SDRs';
        case 'cac': return 'Dashboard de Análise de CAC';
        // NOVO: Título para a página do mapa
        case 'map': return 'Mapa de Vendas';
        default: return 'Dashboard de Vendas';
    }
  }

  if (loading) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Carregando dados...</div>;
  if (error) return <div className="bg-gray-900 text-red-400 min-h-screen flex items-center justify-center p-8 text-center">{error}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex font-sans">
      <Sidebar 
        activePage={activePage} 
        setActivePage={handlePageChange}
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-gray-400">Análise de performance da equipe, automações e custos.</p>
          </header>
          {activePage !== 'ranking' && activePage !== 'cac' && activePage !== 'map' &&
            <DashboardFilters 
              data={allData} 
              filters={filters} 
              setFilters={setFilters} 
              activePage={activePage}
              origens={origens} 
            />}
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
