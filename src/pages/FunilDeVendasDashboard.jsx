import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import GoalGauge from '../components/GoalGauge';
import WeeklyPerformanceTable from '../components/WeeklyPerformanceTable';
import SdrFunnelChart from '../components/SdrFunnelChart';
import { QUALIFIED_STAGES } from '../utils/helpers';

const FunilDeVendasDashboard = ({ data, goals }) => {
  // ... (seu código da página de funil de vendas permanece o mesmo)
  const goalsMap = useMemo(() => {
    return goals.reduce((acc, goal) => {
      acc[goal.Nome_Meta] = parseFloat(goal.Valor_Meta) || 0;
      return acc;
    }, {});
  }, [goals]);

  const leads = data.length;
  const qualificados = data.filter(lead => QUALIFIED_STAGES.some(stage => lead[stage])).length;
  const reunioesAgendadas = data.filter(d => d['Data_Reunião agendada']).length;
  const reunioesRealizadas = data.filter(d => d['Data_Reunião feita']).length;
  const noshow = data.filter(d => d['Data_Noshow']).length;
  const vendas = data.filter(d => d['Data_Venda']).length;

  const taxaQualificadosVsLeads = leads > 0 ? ((qualificados / leads) * 100).toFixed(2) : 0;
  const taxaAgendadosVsQualificados = qualificados > 0 ? ((reunioesAgendadas / qualificados) * 100).toFixed(2) : 0;
  const taxaRealizadasVsAgendadas = reunioesAgendadas > 0 ? ((reunioesRealizadas / reunioesAgendadas) * 100).toFixed(2) : 0;
  const taxaVendasVsRealizadas = reunioesRealizadas > 0 ? ((vendas / reunioesRealizadas) * 100).toFixed(2) : 0;
  const taxaAgendadosVsLeads = leads > 0 ? ((reunioesAgendadas / leads) * 100).toFixed(2) : 0;
  const taxaNoshowVsAgendadas = reunioesAgendadas > 0 ? ((noshow / reunioesAgendadas) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Metas de Conversão do Funil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GoalGauge title="Agendado x Lead" value={parseFloat(taxaAgendadosVsLeads)} goal={goalsMap['Agendado x Lead']} color="purple" />
          <GoalGauge title="Realizada x Agendada" value={parseFloat(taxaRealizadasVsAgendadas)} goal={goalsMap['Realizada x Agendada']} color="yellow" />
          <GoalGauge title="COF Enviada x Realizada" value={0} goal={goalsMap['COF Enviada x Realizada']} color="cyan" />
          <GoalGauge title="Venda x COF Enviada" value={0} goal={goalsMap['Venda x COF Enviada']} color="green" />
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Visão Geral do Funil</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard title="Leads" value={leads} color="orange" small />
            <KpiCard title="Qualificados" value={qualificados} color="cyan" small />
            <KpiCard title="Reuniões Agendadas" value={reunioesAgendadas} color="sky" small />
            <KpiCard title="Reuniões Realizadas" value={reunioesRealizadas} color="yellow" small />
            <KpiCard title="Noshow" value={noshow} color="red" small />
            <KpiCard title="Vendas" value={vendas} color="green" small />
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Taxas de Conversão</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard title="Qualificados / Leads" value={taxaQualificadosVsLeads} unit="%" color="cyan" small />
            <KpiCard title="Agendadas / Qualif." value={taxaAgendadosVsQualificados} unit="%" color="sky" small />
            <KpiCard title="Realizadas / Agend." value={taxaRealizadasVsAgendadas} unit="%" color="yellow" small />
            <KpiCard title="Vendas / Realizadas" value={taxaVendasVsRealizadas} unit="%" color="green" small />
            <KpiCard title="Agendadas / Leads" value={taxaAgendadosVsLeads} unit="%" color="orange" small />
            <KpiCard title="Noshow / Agendadas" value={taxaNoshowVsAgendadas} unit="%" color="red" small />
        </div>
      </div>
      <WeeklyPerformanceTable data={data} />
      <SdrFunnelChart data={data} />
    </div>
  );
};

export default FunilDeVendasDashboard;