import React, { useState, useEffect, useMemo } from 'react';
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

const initialFiltersState = {
  responsavel: 'Todos',
  etapa: 'Todos',
  startDate: '',
  endDate: '',
  origem: 'Todas',
  dateFilterType: 'custom_created_date', // Valor inicial para o novo filtro
};

export default function App() {
  const [allData, setAllData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [cacData, setCacData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('cac');
  const [filters, setFilters] = useState(initialFiltersState);

  const handlePageChange = (page) => {
    setActivePage(page);
    setFilters(initialFiltersState);
  };

  useEffect(() => {
    // Sua função parseCsv e o fetch continuam os mesmos...
    const parseCsv = (csvText, isCac = false) => {
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
            const obj = headers.reduce((obj, header, index) => {
                obj[header] = values[index] ? values[index].trim() : '';
                return obj;
            }, {});
            if (isCac) {
                return {
                    month: obj['Mês/Ano'],
                    investment: parseCurrency(obj['Investimento Total']),
                    leads: parseIntValue(obj['Total de Leads']),
                    sales: parseIntValue(obj['Total de Vendas']),
                    revenue: parseCurrency(obj['Receita Total']),
                    cpl: parseCurrency(obj['CPL (Custo/Lead)']),
                    cac: parseCurrency(obj['CAC (Custo/Cliente)']),
                };
            }
            return obj;
        }).filter(row => isCac ? row.month && row.month.trim() !== '' : true);
    };
    Promise.all([
        fetch(GOOGLE_SHEET_LEADS_CSV_URL).then(res => res.ok ? res.text() : ''),
        fetch(GOOGLE_SHEET_GOALS_CSV_URL).then(res => res.ok ? res.text() : ''),
        fetch(GOOGLE_SHEET_CAC_CSV_URL).then(res => res.ok ? res.text() : '')
    ]).then(([leadsCsv, goalsCsv, newCacCsv]) => {
        setAllData(parseCsv(leadsCsv));
        setGoalsData(parseCsv(goalsCsv));
        setCacData(parseCsv(newCacCsv, true));
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
    // Função auxiliar para converter "DD/MM/AAAA" em um objeto Date
    const parseDate = (dateString) => {
      if (!dateString || typeof dateString !== 'string') return null;
      const parts = dateString.split(' ')[0].split('/');
      if (parts.length !== 3) return null;
      // new Date(ano, mês - 1, dia)
      return new Date(parts[2], parts[1] - 1, parts[0]);
    };

    let data = allData;

    // Filtro de Responsável
    if (filters.responsavel !== 'Todos') {
      let key = 'Responsável';
      if (activePage === 'sdr') key = 'Responsável SDR';
      if (activePage === 'closer') key = 'Responsável Closer';
      data = data.filter(d => d[key] === filters.responsavel);
    }

    // Filtro de Etapa
    if (filters.etapa !== 'Todos' && !['sdr', 'closer', 'cac'].includes(activePage)) {
      data = data.filter(d => d['Etapa Atual'] === filters.etapa);
    }

    // Filtro de Origem
    if (filters.origem !== 'Todas') {
      data = data.filter(d => d.Nome_Lead?.includes(`[${filters.origem}]`));
    }

    // --- NOVO FILTRO DE DATA ATUALIZADO ---
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      // Adiciona 23:59:59 ao final do dia para incluir o dia todo no filtro
      endDate.setHours(23, 59, 59, 999);

      data = data.filter(d => {
        if (filters.dateFilterType === 'any_activity') {
          // 👇 IMPORTANTE: Verifique e ajuste os nomes das colunas aqui 👇
          const datasParaChecar = [
            d['Data_Criacao'], // Já sabemos que esta existe
            d['won_time'],      // Exemplo: data de ganho
            d['lost_time'],     // Exemplo: data de perda
            d['update_time'],   // Exemplo: data de última atualização
          ].map(parseDate); // Converte todas para o formato Date

          // Retorna true se QUALQUER uma das datas válidas estiver no intervalo
          return datasParaChecar.some(date => date && date >= startDate && date <= endDate);
        
        } else {
          // Lógica para filtros de coluna única (Criação, Ganho, etc.)
          // O nome da coluna vem direto do dropdown
          const columnName = filters.dateFilterType === 'custom_created_date' ? 'Data_Criacao' : filters.dateFilterType;
          const leadDate = parseDate(d[columnName]);
          return leadDate && leadDate >= startDate && leadDate <= endDate;
        }
      });
    }

    return data;
  }, [allData, filters, activePage]);

  const renderPage = () => {
    // ... seu renderPage (sem alterações)
    switch (activePage) {
      case 'automation': return <AutomationDashboard data={filteredData} />;
      case 'funil': return <FunilDeVendasDashboard data={filteredData} goals={goalsData} />;
      case 'sdr': return <SdrPerformanceDashboard data={filteredData} />;
      case 'closer': return <CloserPerformanceDashboard data={filteredData} />;
      case 'ranking': return <RankingSdrDashboard allData={allData} filters={filters} />;
      case 'cac': return <CacAnalysisDashboard data={cacData} />;
      default: return <AutomationDashboard data={filteredData} />;
    }
  };
  
  const getPageTitle = () => {
    // ... seu getPageTitle (sem alterações)
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
      <Sidebar activePage={activePage} setActivePage={handlePageChange} />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-gray-400">Análise de performance da equipe, automações e custos.</p>
          </header>
          {activePage !== 'ranking' && activePage !== 'cac' &&
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