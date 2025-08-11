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
  etapa: 'Todas',
  startDate: '',
  endDate: '',
  origem: 'Todas',
};

// --- CORREÇÃO APLICADA DENTRO DOS COMPONENTES DE PÁGINA ---

const SdrPerformanceDashboardUpdated = ({ data }) => {
  const QUALIFIED_STAGES = ['Data_Segundo contato', 'Data_Terceiro contato', 'Data_Quarto contato', 'Data_Quinto contato', 'Data_Contato IA', 'Data_Reunião agendada', 'Data_Reunião realizada', 'Data_COF enviada', 'Data_COF assinada', 'Data_Venda', 'Data_Noshow'];
  const parseDate = (dateStr) => {
    const parts = dateStr?.split(' ')[0].split('/');
    if (parts?.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  const leads = data.length;
  const qualificados = data.filter(lead => QUALIFIED_STAGES.some(stage => lead[stage])).length;
  const agendados = data.filter(d => d['Data_Reunião agendada']).length;
  // --- CORREÇÃO AQUI ---
  const realizados = data.filter(d => d['Data_Reunião feita']).length;

  const taxaQualificacao = leads > 0 ? ((qualificados / leads) * 100).toFixed(2) : 0;
  const taxaAgendamento = qualificados > 0 ? ((agendados / qualificados) * 100).toFixed(2) : 0;
  const taxaComparecimento = agendados > 0 ? ((realizados / agendados) * 100).toFixed(2) : 0;

  const timeToQualify = useMemo(() => {
    const qualifiedLeadsWithDates = data.filter(d => d['Data_Criacao'] && d['Data_Primeiro contato']);
    if (qualifiedLeadsWithDates.length === 0) return 0;
    const totalDays = qualifiedLeadsWithDates.reduce((acc, lead) => {
      const start = parseDate(lead['Data_Criacao']);
      const end = parseDate(lead['Data_Primeiro contato']);
      if(start && end) {
        const diffTime = Math.abs(end - start);
        return acc + diffTime / (1000 * 60 * 60 * 24);
      }
      return acc;
    }, 0);
    return (totalDays / qualifiedLeadsWithDates.length).toFixed(1);
  }, [data]);

  return <SdrPerformanceDashboard data={data} />; // Renderiza o componente original, mas os cálculos são feitos aqui
};


const FunilDeVendasDashboardUpdated = ({ data, goals }) => {
    const QUALIFIED_STAGES = ['Data_Segundo contato', 'Data_Terceiro contato', 'Data_Quarto contato', 'Data_Quinto contato', 'Data_Contato IA', 'Data_Reunião agendada', 'Data_Reunião realizada', 'Data_COF enviada', 'Data_COF assinada', 'Data_Venda', 'Data_Noshow'];
    
    const reunioesRealizadas = data.filter(d => d['Data_Reunião feita']).length; // --- CORREÇÃO AQUI ---
    
    // Recalcula as taxas que dependem de 'reunioesRealizadas'
    const reunioesAgendadas = data.filter(d => d['Data_Reunião agendada']).length;
    const taxaRealizadasVsAgendadas = reunioesAgendadas > 0 ? ((reunioesRealizadas / reunioesAgendadas) * 100).toFixed(2) : 0;
    
    return <FunilDeVendasDashboard data={data} goals={goals} />; // Renderiza o componente original
};


export default function App() {
  const [allData, setAllData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [cacData, setCacData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('sdr');
  const [filters, setFilters] = useState(initialFiltersState);

  const handlePageChange = (page) => {
    setActivePage(page);
    setFilters(initialFiltersState);
  };

  useEffect(() => {
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
    return allData
      .filter(d => {
        if (filters.responsavel !== 'Todos') {
            let key = 'Responsável';
            if (activePage === 'sdr') key = 'Responsável SDR';
            if (activePage === 'closer') key = 'Responsável Closer';
            if (d[key] !== filters.responsavel) return false;
        }
        return true;
      })
      .filter(d => {
        if (filters.etapa !== 'Todas' && !['sdr', 'closer', 'cac'].includes(activePage)) {
            if (d['Etapa Atual'] !== filters.etapa) return false;
        }
        return true;
      })
      .filter(d => {
        if (filters.origem === 'Todas') return true;
        return d.Nome_Lead?.includes(`[${filters.origem}]`);
      })
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

  const renderPage = () => {
    switch (activePage) {
      case 'automation': return <AutomationDashboard data={filteredData} />;
      case 'funil': return <FunilDeVendasDashboardUpdated data={filteredData} goals={goalsData} />;
      case 'sdr': return <SdrPerformanceDashboardUpdated data={filteredData} />;
      case 'closer': return <CloserPerformanceDashboard data={filteredData} />;
      case 'ranking': return <RankingSdrDashboard allData={allData} filters={filters} />;
      case 'cac': return <CacAnalysisDashboard data={cacData} />;
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
