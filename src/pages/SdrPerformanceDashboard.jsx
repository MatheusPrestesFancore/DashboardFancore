import React from 'react';
import KpiCard from '../components/KpiCard';
// O GoalGauge não é mais necessário aqui, a menos que queira mantê-lo para metas numéricas.

const SdrPerformanceDashboard = ({ data }) => {
  // Contagens de cada etapa
  const leads = data.length;
  const reunioesAgendadas = data.filter(d => d['Data_Reunião agendada']).length;
  const reunioesRealizadas = data.filter(d => d['Data_Reunião realizada']).length;
  const cofEnviadas = data.filter(d => d['Data_COF enviada']).length;
  const vendas = data.filter(d => d['Data_Venda']).length;

  // Cálculos das novas taxas de conversão
  const taxaAgendadoVsLead = leads > 0 ? ((reunioesAgendadas / leads) * 100).toFixed(2) : 0;
  const taxaRealizadaVsAgendada = reunioesAgendadas > 0 ? ((reunioesRealizadas / reunioesAgendadas) * 100).toFixed(2) : 0;
  const taxaCofVsRealizada = reunioesRealizadas > 0 ? ((cofEnviadas / reunioesRealizadas) * 100).toFixed(2) : 0;
  const taxaVendaVsCof = cofEnviadas > 0 ? ((vendas / cofEnviadas) * 100).toFixed(2) : 0;

  return (
    <>
      {/* NOVA SECÇÃO DE METAS DE CONVERSÃO */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Metas de Conversão do Funil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Agendado x Lead" value={taxaAgendadoVsLead} unit="%" color="purple" small />
          <KpiCard title="Realizada x Agendada" value={taxaRealizadaVsAgendada} unit="%" color="yellow" small />
          <KpiCard title="COF Enviada x Realizada" value={taxaCofVsRealizada} unit="%" color="cyan" small />
          <KpiCard title="Venda x COF Enviada" value={taxaVendaVsCof} unit="%" color="green" small />
        </div>
      </div>

      {/* KPIs de contagem total (como antes) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <KpiCard title="Leads" value={leads} color="blue" small />
          <KpiCard title="Reuniões Agendadas" value={reunioesAgendadas} color="purple" small />
          <KpiCard title="Reuniões Realizadas" value={reunioesRealizadas} color="yellow" small />
          <KpiCard title="COF Enviadas" value={cofEnviadas} color="cyan" small />
          <KpiCard title="Vendas" value={vendas} color="green" small />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Funil de Conversão SDR</h3>
          <p className="text-gray-400">Gráfico de funil detalhado para a performance do SDR a ser adicionado aqui.</p>
      </div>
    </>
  );
};

export default SdrPerformanceDashboard;