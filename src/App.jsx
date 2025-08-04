import React, { useState, useEffect, useMemo } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardFilters from './components/DashboardFilters';
import AutomationDashboard from './pages/AutomationDashboard';
import SdrPerformanceDashboard from './pages/SdrPerformanceDashboard';
import CloserPerformanceDashboard from './pages/CloserPerformanceDashboard';
import FunilDeVendasDashboard from './pages/FunilDeVendasDashboard';
import RankingSdrDashboard from './pages/RankingSdrDashboard';
import CacAnalysisDashboard from './pages/CacAnalysisDashboard';

// URLs das planilhas
const GOOGLE_SHEET_LEADS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=1495728090&single=true&output=csv';
const GOOGLE_SHEET_GOALS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=515919224&single=true&output=csv';
const GOOGLE_SHEET_CAC_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=855119221&single=true&output=csv';


export default function App() {
  const [allData, setAllData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [cacData, setCacData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('automation'); // Voltando para a página inicial padrão
  const [filters, setFilters] = useState({
    responsavel: 'Todos',
    etapa: 'Todas',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const parseCsv = (csvText, isCac = false) => {
        if (!csvText) return [];
        const lines = csvText.trim().split(/\r?\n/);
        const headers = lines[0].split(',').map(header => header.trim());
        
        const cleanAndParse = (value, parser) => {
            if (typeof value !== 'string' || value.includes('#ERROR!')) {
                return 0;
            }
            const cleanedValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
            return parser(cleanedValue) || 0;
        };
        
        return lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = headers.reduce((obj, header, index) => {
                obj[header] = values[index] ? values[index].trim() : '';
                return obj;
            }, {});

            if (isCac) {
                return {
                    month: obj['Mês/Ano'],
                    investment: cleanAndParse(obj['Investimento Total'], parseFloat),
                    leads: cleanAndParse(obj['Total de Leads'], parseInt),
                    sales: cleanAndParse(obj['Total de Vendas'], parseInt),
                    revenue: cleanAndParse(obj['Receita Total'], parseFloat),
                    cpl: cleanAndParse(obj['CPL (Custo/Lead)'], parseFloat),
                    cac: cleanAndParse(obj['CAC (Custo/Cliente)'], parseFloat),
                };
            }
            return obj;
        }).filter(row => isCac ? row.month && row.month.trim() !== '' : true);
    };

    Promise.all([
        fetch(GOOGLE_SHEET_LEADS_CSV_URL).then(res => res.ok ? res.text() : ''),
        fetch(GOOGLE_SHEET_GOALS_CSV_URL).then(res => res.ok ? res.text() : ''),
        fetch(GOOGLE_SHEET_CAC_CSV_URL).then(res => res.ok ? res.text() : '')
    ])
    .then(([leadsCsv, goalsCsv, newCacCsv]) => {
        setAllData(parseCsv(leadsCsv));
        setGoalsData(parseCsv(goalsCsv));
        setCacData(parseCsv(newCacCsv, true));
        setLoading(false);
    })
    .catch(err => {
        setError('Falha ao carregar os dados das planilhas.');
        setLoading(false);
    });
  }, []);
  
  const filteredData = useMemo(() => {
    return allData
      .filter(d => filters.responsavel === 'Todos' || d[activePage === 'sdr' ? 'Responsável SDR' : 'Responsável Closer'] === filters.responsavel)
      .filter(d => filters.etapa === 'Todas' || !['sdr', 'closer', 'cac'].includes(activePage) || d['Etapa Atual'] === filters.etapa)
      .filter(d => {
        if (!filters.startDate || !filters.endDate) return true;
        const parts = d['Data_Criacao']?.split(' ')[0].split('/');
        if (parts?.length !== 3) return false;
        const leadDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return leadDate >= startDate && leadDate <= endDate;
      });
  }, [allData, filters, activePage]);

  const filteredCacData = useMemo(() => {
    if (!filters.startDate || !filters.endDate) return cacData;
    
    return cacData.filter(row => {
        const monthYear = row.month.split('/');
        if (monthYear.length !== 2) return false;
        
        const monthMap = { 'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5, 'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11 };
        const monthIndex = monthMap[monthYear[0].toLowerCase()];
        if (monthIndex === undefined) return false;

        const rowDate = new Date(parseInt(monthYear[1]), monthIndex, 1);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);

        return rowDate >= startDate && rowDate <= endDate;
    });
  }, [cacData, filters]);

  // --- CORREÇÃO AQUI: RESTAURANDO TODAS AS PÁGINAS ---
  const renderPage = () => {
    switch (activePage) {
      case 'automation': return <AutomationDashboard data={filteredData} />;
      case 'funil': return <FunilDeVendasDashboard data={filteredData} goals={goalsData} />;
      case 'sdr': return <SdrPerformanceDashboard data={filteredData} />;
      case 'closer': return <CloserPerformanceDashboard data={filteredData} />;
      case 'ranking': return <RankingSdrDashboard allData={allData} filters={filters} />;
      case 'cac': return <CacAnalysisDashboard data={filteredCacData} />;
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
       default: return 'Dashboard de Vendas';
     }
  }

  if (loading) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Carregando dados...</div>;
  if (error) return <div className="bg-gray-900 text-red-400 min-h-screen flex items-center justify-center p-8 text-center">{error}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-gray-400">Análise de performance da equipe, automações e custos.</p>
          </header>
          {activePage !== 'ranking' && <DashboardFilters data={allData} filters={filters} setFilters={setFilters} activePage={activePage} />}
          {renderPage()}
        </div>
      </main>
    </div>
  );
}