import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import CacFilters from './components/CacFilters';
import DashboardFilters from './components/DashboardFilters';
import FunilSimplificadoDashboard from './pages/FunilSimplificadoDashboard';
import CacAnalysisDashboard from './pages/CacAnalysisDashboard';
import MapaVendasDashboard from './pages/MapaVendasDashboard';
import VisaoGeralDashboard from './pages/VisaoGeralDashboard';
import MapFilters from './components/MapFilters';
import { Tooltip } from 'react-tooltip';
import 'leaflet/dist/leaflet.css';

// URLs
const GOOGLE_SHEET_LEADS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=2062685069&single=true&output=csv';
const GOOGLE_SHEET_GOALS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=515919224&single=true&output=csv';
const GOOGLE_SHEET_CAC_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=855119221&single=true&output=csv';
const GOOGLE_SHEET_MAP_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=469774215&single=true&output=csv';
const GOOGLE_SHEET_FUNIL_AGREGADO_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=1835098963&single=true&output=csv';
const GOOGLE_SHEET_CAC_ESTICA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8micyxeetXOwd7DswczU-nhMaBO7KCA0rHsTAgoAkJMQTWrcJHkV4aSRQ_I-cfctWM6cNToluCzJ0/pub?gid=589411187&single=true&output=csv';

const initialFiltersState = {
    responsavel: 'Todos',
    etapa: 'Todos',
    startDate: '',
    endDate: '',
    origem: 'Todas',
    dateFilterType: 'custom_created_date',
};

const initialCacFiltersState = {
    startMonth: '',
    endMonth: '',
    channels: ['Todos'],
    costSources: ['3P', 'P9', 'Interno'],
};

// Canais que não têm custo de marketing associado
const ZERO_COST_CHANNELS = ['Franqueado'];

export default function App() {
    const [allData, setAllData] = useState([]);
    const [goalsData, setGoalsData] = useState([]);
    const [cacSalesData, setCacSalesData] = useState([]);
    const [cacSalesDataEstica, setCacSalesDataEstica] = useState([]);
    const [cacMonthlyCostsEstica, setCacMonthlyCostsEstica] = useState([]);
    const [cacMonthlyCosts, setCacMonthlyCosts] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [funilAgregadoData, setFunilAgregadoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePage, setActivePage] = useState('overview');
    const [filters, setFilters] = useState(initialFiltersState);
    const [cacFilters, setCacFilters] = useState(initialCacFiltersState);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [selectedState, setSelectedState] = useState('Todos');
    const [activeBrand, setActiveBrand] = useState('Agrobar');

    // Controle de origem da atualização do filtro (channels ou costs)
    const cacUpdateSource = useRef(null);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handlePageChange = (page) => {
        setActivePage(page);
        setFilters(initialFiltersState);
        setSelectedState('Todos');
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    useEffect(() => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
    }, []);

    // --- Lógica de Carregamento e Parsing ---
    useEffect(() => {
        const parseCurrency = (value) => { if (typeof value !== 'string' || !value) return 0; return parseFloat(value.replace(/R\$\s?|\./g, '').replace(',', '.')) || 0; };
        const parseIntValue = (value) => { if (typeof value !== 'string' || !value) return 0; return parseInt(value.replace(/^"|"$/g, '').trim(), 10) || 0; };

        const parseCsvLine = (line) => {
            const result = []; let current = ''; let inQuotes = false;
            for (const char of line) {
                if (char === '"' && !inQuotes) { inQuotes = true; }
                else if (char === '"' && inQuotes) { inQuotes = false; }
                else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
                else { current += char; }
            }
            result.push(current.trim()); return result;
        };

        const parseCacCsv = (csvText) => {
            if (!csvText) return { sales: [], costs: [] };
            const lines = csvText.trim().split(/\r?\n/);
            const headers = parseCsvLine(lines[0]);
            const sales = []; const costs = [];
            const monthlyCostsHeaderIndex = headers.findIndex((h, i) => h === 'Mês/Ano' && i > 5);

            lines.slice(1).forEach(line => {
                const values = parseCsvLine(line);
                const sale = { date: values[0], city: values[1], value: parseCurrency(values[2]), channel: values[3], month: values[4], };
                if (sale.channel && sale.month) sales.push(sale);

                if (monthlyCostsHeaderIndex > -1) {
                    const cost = {
                        month: values[monthlyCostsHeaderIndex],
                        google3p_cost: parseCurrency(values[monthlyCostsHeaderIndex + 1]), google3p_leads: parseIntValue(values[monthlyCostsHeaderIndex + 2]),
                        meta3p_cost: parseCurrency(values[monthlyCostsHeaderIndex + 3]), meta3p_leads: parseIntValue(values[monthlyCostsHeaderIndex + 4]),
                        googlep9_cost: parseCurrency(values[monthlyCostsHeaderIndex + 5]), googlep9_leads: parseIntValue(values[monthlyCostsHeaderIndex + 6]),
                        metap9_cost: parseCurrency(values[monthlyCostsHeaderIndex + 7]), metap9_leads: parseIntValue(values[monthlyCostsHeaderIndex + 8]),
                        internal_cost: parseCurrency(values[monthlyCostsHeaderIndex + 9]), internal_leads: parseIntValue(values[monthlyCostsHeaderIndex + 10]),
                        area_cost: parseCurrency(values[monthlyCostsHeaderIndex + 11]),
                    };
                    if (cost.month && !costs.some(c => c.month === cost.month)) costs.push(cost);
                }
            });
            return { sales, costs };
        };

        const parseGenericCsv = (csvText) => {
            if (!csvText) return [];
            const lines = csvText.trim().split(/\r?\n/);
            const headers = parseCsvLine(lines[0]);
            return lines.slice(1).map(line => {
                const values = parseCsvLine(line);
                if (values.length !== headers.length) { return null; }
                return headers.reduce((obj, header, index) => {
                    const cleanHeader = header.replace(/^"|"$/g, '').trim();
                    obj[cleanHeader] = values[index] ? values[index].replace(/^"|"$/g, '').trim() : '';
                    return obj;
                }, {});
            }).filter(obj => obj && obj[headers[0].replace(/^"|"$/g, '').trim()]);
        };

        const parseMapCsv = (csvText) => {
            if (!csvText) return [];
            const lines = csvText.trim().split(/\r?\n/);
            const headers = parseCsvLine(lines[0]);
            return lines.slice(1).map(line => {
                const values = parseCsvLine(line);
                if (values.length !== headers.length) { return null; }

                const obj = headers.reduce((acc, header, index) => {
                    const cleanHeader = header.trim().toLowerCase();
                    acc[cleanHeader] = values[index];
                    return acc;
                }, {});

                return {
                    id: obj['id'],
                    city: obj['cidade'],
                    state: obj['estado'],
                    status: obj['status'],
                    lat: parseFloat(obj['latitude']),
                    lng: parseFloat(obj['longitude']),
                    saleDate: obj['data_venda'],
                    implementationDate: obj['data_inauguração'],
                    googleMapsUrl: obj['link_google_maps'],
                };
            }).filter(item => item && item.lat && item.lng);
        };

        Promise.all([
            fetch(GOOGLE_SHEET_LEADS_CSV_URL).then(res => res.ok ? res.text() : ''),
            fetch(GOOGLE_SHEET_GOALS_CSV_URL).then(res => res.ok ? res.text() : ''),
            fetch(`${GOOGLE_SHEET_CAC_CSV_URL}&t=${Date.now()}`).then(res => res.ok ? res.text() : ''),
            fetch(GOOGLE_SHEET_MAP_CSV_URL).then(res => res.ok ? res.text() : ''),
            fetch(GOOGLE_SHEET_FUNIL_AGREGADO_CSV_URL).then(res => res.ok ? res.text() : ''),
            fetch(`${GOOGLE_SHEET_CAC_ESTICA_URL}&t=${Date.now()}`).then(res => res.ok ? res.text() : '')
        ]).then(([leadsCsv, goalsCsv, cacCsvAgro, mapCsv, funilAgregadoCsv, cacCsvEstica]) => {
            const agro = parseCacCsv(cacCsvAgro);
            setCacSalesData(agro.sales);
            setCacMonthlyCosts(agro.costs);

            // Dados Estica
            const estica = parseCacCsv(cacCsvEstica);
            setCacSalesDataEstica(estica.sales);
            setCacMonthlyCostsEstica(estica.costs);

            setAllData(parseGenericCsv(leadsCsv));
            setGoalsData(parseGenericCsv(goalsCsv));
            setMapData(parseMapCsv(mapCsv));
            setFunilAgregadoData(parseGenericCsv(funilAgregadoCsv));

            const activeCosts = activeBrand === 'Agrobar' ? agro.costs : estica.costs;
            if (activeCosts.length > 0) {
                const monthOrder = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
                const sortedMonths = [...new Set(activeCosts.map(d => d.month).filter(Boolean))].sort((a, b) => { const [monthA, yearA] = a.split('/'); const [monthB, yearB] = b.split('/'); if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB); return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB); });

                const hoje = new Date();
                let prevMonthIndex = hoje.getMonth() - 1;
                let prevMonthYear = hoje.getFullYear();
                if (prevMonthIndex < 0) {
                    prevMonthIndex = 11;
                    prevMonthYear -= 1;
                }
                const mesAnterior = monthOrder[prevMonthIndex] + '/' + prevMonthYear;
                const mesFinal = sortedMonths.includes(mesAnterior) ? mesAnterior : sortedMonths[sortedMonths.length - 1];

                setCacFilters(prev => ({
                    ...prev,
                    startMonth: sortedMonths[0],
                    endMonth: sortedMonths[sortedMonths.length - 1],
                }));
            }
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setError('Falha ao carregar os dados das planilhas.');
            setLoading(false);
        });
    }, []);




    // --- Memos e Cálculos ---
    const origens = useMemo(() => {
        const tags = new Set();
        allData.forEach(lead => { const match = lead.Nome_Lead?.match(/\[(.*?)\]/); if (match && match[1]) { tags.add(match[1]); } });
        return ['Todas', ...Array.from(tags)];
    }, [allData]);

    // Cálculo do CAC
    const availableCacMonths = useMemo(() => { const source = activeBrand === 'Agrobar' ? cacMonthlyCosts : cacMonthlyCostsEstica; const months = [...new Set(source.map(d => d.month).filter(Boolean))]; const monthOrder = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']; return months.sort((a, b) => { const [monthA, yearA] = a.split('/'); const [monthB, yearB] = b.split('/'); if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB); return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB); }); }, [cacMonthlyCosts, cacMonthlyCostsEstica, activeBrand]);
    const availableCacChannels = useMemo(() => { const source = activeBrand === 'Agrobar' ? cacSalesData : cacSalesDataEstica; return ['Todos', ...new Set(source.map(s => s.channel).filter(Boolean)), ...ZERO_COST_CHANNELS]; }, [cacSalesData, cacSalesDataEstica, activeBrand]);
    const funilAgregadoPorMes = useMemo(() => {
        const mesesMap = {
            Janeiro: 'jan.',
            Fevereiro: 'fev.',
            Março: 'mar.',
            Abril: 'abr.',
            Maio: 'mai.',
            Junho: 'jun.',
            Julho: 'jul.',
            Agosto: 'ago.',
            Setembro: 'set.',
            Outubro: 'out.',
            Novembro: 'nov.',
            Dezembro: 'dez.',
        };

        return funilAgregadoData.reduce((acc, row) => {
            const mesNome = row['Mês']?.trim();
            const ano = row['Ano']?.trim();

            if (!mesNome || !ano) return acc;

            const mesAbreviado = mesesMap[mesNome];

            if (!mesAbreviado) return acc;

            const month = `${mesAbreviado}/${ano}`;

            acc[month] = {
                leads_funil: parseInt(row['Leads'] || 0, 10) || 0,
                mql_qualificados: parseInt(row['Qualificado'] || 0, 10) || 0,
                mql_agendadas: parseInt(row['Agendamento'] || 0, 10) || 0,
                sql_realizadas: parseInt(row['Realizado'] || 0, 10) || 0,
                cof_assinada: parseInt(row['COF assinada'] || 0, 10) || 0,
                vendas_funil: parseInt(row['Total de vendas'] || row['Venda'] || 0, 10) || 0,
            };

            return acc;
        }, {});
    }, [funilAgregadoData]);
    const calculateCacMetrics = (salesData, costsData, months, channels, costSources, allChannels, funilPorMes) => {
        const isTodos = channels.includes('Todos');
        const filteredSales = isTodos ? salesData : salesData.filter(s => channels.includes(s.channel));

        const salesByMonth = filteredSales.reduce((acc, sale) => {
            if (!acc[sale.month]) acc[sale.month] = { count: 0, revenue: 0 };
            acc[sale.month].count += 1;
            acc[sale.month].revenue += sale.value;
            return acc;
        }, {});

        return months.map(month => {
            const monthSales = salesByMonth[month] || { count: 0, revenue: 0 };
            const monthCosts = costsData.find(c => c.month === month);
            if (!monthCosts) return null;

            let investmentMarketing = 0;
            let areaCost = 0;
            let leads = 0;
            const selectedSources = costSources;
            const channelsToProcess = isTodos ? allChannels.filter(c => c !== 'Todos' && !ZERO_COST_CHANNELS.includes(c)) : channels;

            channelsToProcess.forEach(channel => {
                switch (channel) {
                    case 'Meta (Agencia)':
                        if (selectedSources.includes('3P')) investmentMarketing += monthCosts.meta3p_cost;
                        if (selectedSources.includes('P9')) investmentMarketing += monthCosts.metap9_cost;
                        leads += monthCosts.meta3p_leads + monthCosts.metap9_leads;
                        break;
                    case 'Google (Agencia)':
                        if (selectedSources.includes('3P')) investmentMarketing += monthCosts.google3p_cost;
                        if (selectedSources.includes('P9')) investmentMarketing += monthCosts.googlep9_cost;
                        leads += monthCosts.google3p_leads + monthCosts.googlep9_leads;
                        break;
                    case 'Meta (Interno)':
                        if (selectedSources.includes('Interno')) investmentMarketing += monthCosts.internal_cost;
                        leads += monthCosts.internal_leads;
                        break;
                    default: break;
                }
            });

            if (selectedSources.includes('Área')) {
                areaCost = monthCosts.area_cost;
            }

            const investmentTotal = investmentMarketing + areaCost;

            const funilMonth = funilPorMes?.[month] || {};

            const leadsFunil = funilMonth.leads_funil || 0;
            const mqlQualificados = funilMonth.mql_qualificados || 0;
            const mqlAgendadas = funilMonth.mql_agendadas || 0;
            const sqlRealizadas = funilMonth.sql_realizadas || 0;

            const salesCount = monthSales.count > 0
                ? monthSales.count
                : (isTodos ? (funilMonth.vendas_funil || 0) : 0);

            return {
                month,
                sales: salesCount,
                revenue: monthSales.revenue,
                investment_total: investmentTotal,
                investment_marketing: investmentMarketing,
                area_cost: areaCost,

                // Leads da planilha de CAC
                leads,

                // Dados vindos do Funil Simplificado
                leads_funil: leadsFunil,
                mql_qualificados: mqlQualificados,
                mql_agendadas: mqlAgendadas,
                sql_realizadas: sqlRealizadas,

                // Custos principais
                cac: salesCount > 0 ? investmentTotal / salesCount : 0,
                cpl: leads > 0 ? investmentMarketing / leads : 0,

                // Custos vindos do cruzamento CAC + Funil
                custoMqlAgendadas: mqlAgendadas > 0 ? investmentMarketing / mqlAgendadas : 0,
                custoSqlRealizadas: sqlRealizadas > 0 ? investmentMarketing / sqlRealizadas : 0,
            };
        }).filter(Boolean);
    };

    const processedCacData = useMemo(() => { const salesSource = activeBrand === 'Agrobar' ? cacSalesData : cacSalesDataEstica; const costsSource = activeBrand === 'Agrobar' ? cacMonthlyCosts : cacMonthlyCostsEstica; if (!cacFilters.startMonth || !cacFilters.endMonth || !availableCacChannels) return []; const startIndex = availableCacMonths.indexOf(cacFilters.startMonth); const endIndex = availableCacMonths.indexOf(cacFilters.endMonth); if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) return []; const selectedMonths = availableCacMonths.slice(startIndex, endIndex + 1); return calculateCacMetrics(salesSource, costsSource, selectedMonths, cacFilters.channels, cacFilters.costSources, availableCacChannels, funilAgregadoPorMes); }, [cacFilters, cacSalesData, cacMonthlyCosts, cacSalesDataEstica, cacMonthlyCostsEstica, activeBrand, availableCacMonths, availableCacChannels, funilAgregadoPorMes]);

    const overviewCacData = useMemo(() => { const salesSource = activeBrand === 'Agrobar' ? cacSalesData : cacSalesDataEstica; const costsSource = activeBrand === 'Agrobar' ? cacMonthlyCosts : cacMonthlyCostsEstica; if (costsSource.length === 0 || !availableCacChannels || availableCacChannels.length <= 1) return []; return calculateCacMetrics(salesSource, costsSource, availableCacMonths, ['Todos'], ['3P', 'P9', 'Interno', 'Área'], availableCacChannels, funilAgregadoPorMes); }, [cacSalesData, cacMonthlyCosts, cacSalesDataEstica, cacMonthlyCostsEstica, activeBrand, availableCacMonths, availableCacChannels, funilAgregadoPorMes]);

    const availableStates = useMemo(() => { if (!mapData) return []; const states = [...new Set(mapData.map(item => item.state).filter(Boolean))]; return states.sort(); }, [mapData]);
    const filteredMapData = useMemo(() => { if (selectedState === 'Todos') { return mapData; } return mapData.filter(item => item.state === selectedState); }, [mapData, selectedState]);

    const renderPage = () => {
        switch (activePage) {
            case 'overview': return <VisaoGeralDashboard allData={allData} cacData={overviewCacData} mapData={mapData} />;
            case 'funil': return <FunilSimplificadoDashboard data={funilAgregadoData} />;
            case 'cac': return <CacAnalysisDashboard data={processedCacData} />;
            case 'map': return <MapaVendasDashboard data={filteredMapData} />;
            default: return <VisaoGeralDashboard allData={allData} cacData={overviewCacData} mapData={mapData} />;
        }
    };

    const getPageTitle = () => {
        switch (activePage) {
            case 'overview': return 'Visão Geral';
            case 'funil': return 'Funil de Vendas ';
            case 'cac': return 'Dashboard de Análise de CAC';
            case 'map': return 'Mapa de Vendas';
            default: return 'Dashboard de Vendas';
        }
    };

    if (loading) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Carregando dados...</div>;
    if (error) return <div className="bg-gray-900 text-red-400 min-h-screen flex items-center justify-center p-8 text-center">{error}</div>;

    return (
        <div className="bg-gray-900 text-white min-h-screen flex font-sans relative">
            <Sidebar activePage={activePage} setActivePage={handlePageChange} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-y-auto w-full">
                <div className="p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8 hidden lg:block">
                            <h1 className="text-3xl font-bold text-white">{getPageTitle()}</h1>
                            <p className="text-gray-400">Análise de performance da equipe, automações e custos.</p>
                        </header>

                        {/* Seletor de Marca (Agrobar vs Estica) Retirado pois só cuidamos dos dados do Agrobar*/}
                        {activePage === 'cac' && (
                            <div className="flex flex-col gap-6 mb-8">
                                <div className="flex justify-center">
                                </div>

                                {/* Filtros originais de CAC que você já tem na imagem */}
                                <CacFilters
                                    filters={cacFilters}
                                    setFilters={setCacFilters}
                                    availableMonths={availableCacMonths}
                                    availableChannels={availableCacChannels}
                                />
                            </div>
                        )}

                        {activePage === 'map' && (
                            <MapFilters
                                availableStates={availableStates}
                                selectedState={selectedState}
                                setSelectedState={setSelectedState}
                            />
                        )}

                        {renderPage()}
                    </div>
                </div>
            </main>
            <Tooltip id="kpi-tooltip" delayShow={350} />
        </div>
    );
}