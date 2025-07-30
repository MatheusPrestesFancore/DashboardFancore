import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardFilters from './components/DashboardFilters';
import AutomationDashboard from './pages/AutomationDashboard';
import SdrPerformanceDashboard from './pages/SdrPerformanceDashboard';
import CloserPerformanceDashboard from './pages/CloserPerformanceDashboard';
import FunilDeVendasDashboard from './pages/FunilDeVendasDashboard';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=1495728090&single=true&output=csv';
const GOOGLE_SHEET_GOALS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=515919224&single=true&output=csv';

export default function App() {
  const [allData, setAllData] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('automation');
  const [filters, setFilters] = useState({
    responsavel: 'Todos',
    etapa: 'Todas',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const parseCsv = (csvText) => {
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(header => header.trim().replace(/\r/g, ''));
      return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] ? values[index].trim().replace(/\r/g, '') : '';
          return obj;
        }, {});
      });
    };

    Promise.all([
      fetch(GOOGLE_SHEET_CSV_URL).then(response => response.text()),
      fetch(GOOGLE_SHEET_GOALS_CSV_URL).then(response => response.text())
    ])
    .then(([leadsCsv, goalsCsv]) => {
      setAllData(parseCsv(leadsCsv));
      setGoalsData(parseCsv(goalsCsv));
      setLoading(false);
    })
    .catch(err => {
      setError('Falha ao carregar os dados das planilhas. Verifique os URLs e as permissões de partilha (publicar na web).');
      setLoading(false);
    });
  }, []);

  const filteredData = useMemo(() => {
    return allData
      .filter(d => filters.responsavel === 'Todos' || d['Responsável'] === filters.responsavel)
      .filter(d => filters.etapa === 'Todas' || d['Etapa Atual'] === filters.etapa)
      .filter(d => {
        if (!filters.startDate || !filters.endDate) return true;
        const parts = d['Data_Criacao']?.split(' ')[0].split('/');
        if (parts?.length !== 3) return false;
        const leadDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        startDate.setUTCHours(0,0,0,0);
        endDate.setUTCHours(0,0,0,0);
        leadDate.setUTCHours(0,0,0,0);
        return leadDate >= startDate && leadDate <= endDate;
      })
      .sort((a, b) => new Date(b.Data_Criacao) - new Date(a.Data_Criacao));
  }, [allData, filters]);

  const renderPage = () => {
    switch (activePage) {
      case 'automation':
        return <AutomationDashboard data={filteredData} />;
      case 'funil':
        return <FunilDeVendasDashboard data={filteredData} goals={goalsData} />;
      case 'sdr':
        return <SdrPerformanceDashboard data={filteredData} />;
      case 'closer':
        return <CloserPerformanceDashboard data={filteredData} />;
      default:
        return <AutomationDashboard data={filteredData} />;
    }
  };
  
  const getPageTitle = () => {
     switch (activePage) {
      case 'automation':
        return 'Dashboard de Automação';
      case 'funil':
        return 'Dashboard Funil de Vendas';
      case 'sdr':
        return 'Dashboard de Performance SDR';
      case 'closer':
        return 'Dashboard de Performance Closer';
      default:
        return 'Dashboard de Vendas';
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
            <p className="text-gray-400">Análise de performance da equipa e automações.</p>
          </header>
          <DashboardFilters data={allData} filters={filters} setFilters={setFilters} />
          {renderPage()}
        </div>
      </main>
    </div>
  );
}