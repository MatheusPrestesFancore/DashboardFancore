import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { Trophy, CircleDollarSign, Building2, CalendarCheck, TrendingUp, Briefcase, FileSignature } from 'lucide-react';

const VisaoGeralDashboard = ({ allData, cacData, mapData }) => {

  const summaryKpis = useMemo(() => {
    if (!allData || !cacData || !mapData) {
      return { totalSales: 0, taxaAgendamentoGeral: 0, averageCac: 0, totalRevenue: 0, cidadesImplementadas: 0, cidadesVendidas: 0 };
    }
    // Vendas Totais & Taxa de Agendamento do funil completo
    const totalSales = allData.filter(d => d['Data_Venda']).length;
    const totalLeads = allData.length;
    const totalAgendados = allData.filter(d => d['Data_Reunião agendada']).length;
    const taxaAgendamentoGeral = totalLeads > 0 ? ((totalAgendados / totalLeads) * 100).toFixed(2) : 0;

    // CAC Médio e Receita da planilha de CAC
    const totalInvestment = cacData.reduce((sum, row) => sum + (row.investment_total || 0), 0);
    const totalSalesCac = cacData.reduce((sum, row) => sum + (row.sales || 0), 0);
    const averageCac = totalSalesCac > 0 ? totalInvestment / totalSalesCac : 0;
    const totalRevenue = cacData.reduce((sum, row) => sum + (row.revenue || 0), 0);

    // Cidades da planilha de Mapa
    const cidadesImplementadas = mapData.filter(c => c.status === 'Implementada').length;
    const cidadesVendidas = mapData.filter(c => c.status === 'Vendida').length;

    return {
      totalSales,
      taxaAgendamentoGeral,
      averageCac,
      totalRevenue,
      cidadesImplementadas,
      cidadesVendidas
    };
  }, [allData, cacData, mapData]);

  const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-8">
      {/* Seção Explicativa */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
          <Briefcase className="h-8 w-8 text-orange-500 mr-4 mb-2 sm:mb-0 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-white">Sobre a Área de Expansão</h2>
            <p className="text-gray-400">Nossa missão é levar a Fancore para novas fronteiras.</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed">
          A área de Expansão é o motor de crescimento da Fancore, responsável por identificar, negociar e implementar novas unidades AgroBar em todo o território nacional. Este dashboard consolida os principais indicadores de performance do nosso funil de vendas, desde a prospecção inicial de leads até a assinatura de contrato e a implementação de novas lojas, fornecendo uma visão clara sobre o nosso avanço e eficiência operacional.
        </p>
      </div>

      {/* Seção de KPIs Principais */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Resumo Executivo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard title="Vendas Totais (Período)" value={summaryKpis.totalSales.toLocaleString('pt-BR')} icon={<Trophy />} color="green" />
          <KpiCard title="Receita Total (CAC)" value={formatCurrency(summaryKpis.totalRevenue)} icon={<TrendingUp />} color="sky" />
          <KpiCard title="CAC Médio Total" value={formatCurrency(summaryKpis.averageCac)} icon={<CircleDollarSign />} color="orange" />
          <KpiCard title="Unidades Implementadas" value={summaryKpis.cidadesImplementadas.toLocaleString('pt-BR')} icon={<Building2 />} color="cyan" />
          <KpiCard title="Total de Contratos" value={(summaryKpis.cidadesImplementadas + summaryKpis.cidadesVendidas).toLocaleString('pt-BR')} icon={<FileSignature />} color="purple" />
          <KpiCard title="Taxa de Agendamento (Geral)" value={summaryKpis.taxaAgendamentoGeral} unit="%" icon={<CalendarCheck />} color="yellow" />
        </div>
      </div>
    </div>
  );
};

export default VisaoGeralDashboard;
