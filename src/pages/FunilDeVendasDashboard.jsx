import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import GoalGauge from '../components/GoalGauge';
import WeeklyPerformanceTable from '../components/WeeklyPerformanceTable';
import SdrFunnelChart from '../components/SdrFunnelChart';
import { QUALIFIED_STAGES } from '../utils/helpers';

const FunilDeVendasDashboard = ({ data, goals }) => {
  const goalsMap = useMemo(() => {
    return goals.reduce((acc, goal) => {
      acc[goal.Nome_Meta] = parseFloat(goal.Valor_Meta) || 0;
      return acc;
    }, {});
  }, [goals]);

  // Contagens de cada etapa
  const leads = data.length;
  const qualificados = data.filter(lead => QUALIFIED_STAGES.some(stage => lead[stage])).length;
  const reunioesAgendadas = data.filter(d => d['Data_Reunião agendada']).length;
  const reunioesRealizadas = data.filter(d => d['Data_Reunião feita']).length;
  const noshow = data.filter(d => d['Data_Noshow']).length;
  const vendas = data.filter(d => d['Data_Venda']).length;
  const cofEnviadas = data.filter(d => d['Data_COF Enviada']).length;

  // Cálculos das taxas de conversão
  const taxaQualificadosVsLeads = leads > 0 ? ((qualificados / leads) * 100).toFixed(2) : 0;
  const taxaAgendadosVsQualificados = qualificados > 0 ? ((reunioesAgendadas / qualificados) * 100).toFixed(2) : 0;
  const taxaRealizadasVsAgendadas = reunioesAgendadas > 0 ? ((reunioesRealizadas / reunioesAgendadas) * 100).toFixed(2) : 0;
  const taxaVendasVsRealizadas = reunioesRealizadas > 0 ? ((vendas / reunioesRealizadas) * 100).toFixed(2) : 0;
  const taxaAgendadosVsLeads = leads > 0 ? ((reunioesAgendadas / leads) * 100).toFixed(2) : 0;
  const taxaNoshowVsAgendadas = reunioesAgendadas > 0 ? ((noshow / reunioesAgendadas) * 100).toFixed(2) : 0;
  const taxaCofEnviadaVsRealizada = reunioesRealizadas > 0 ? ((cofEnviadas / reunioesRealizadas) * 100).toFixed(2) : 0;
  const taxaVendaVsCofEnviada = cofEnviadas > 0 ? ((vendas / cofEnviadas) * 100).toFixed(2) : 0;


  return (
    <div className="space-y-8">
      {/* ALTERADO: Padding ajustado para p-4 em telas pequenas e sm:p-6 em maiores */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Metas de Conversão do Funil</h3>
        {/* Nenhuma alteração necessária no grid, ele já é responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GoalGauge title="Agendado x Lead" value={parseFloat(taxaAgendadosVsLeads)} goal={goalsMap['Agendado x Lead']} color="purple" />
          <GoalGauge title="Realizada x Agendada" value={parseFloat(taxaRealizadasVsAgendadas)} goal={goalsMap['Realizada x Agendada']} color="yellow" />
          <GoalGauge title="COF Enviada x Realizada" value={parseFloat(taxaCofEnviadaVsRealizada)} goal={goalsMap['COF Enviada x Realizada']} color="cyan" />
          <GoalGauge title="Venda x COF Enviada" value={parseFloat(taxaVendaVsCofEnviada)} goal={goalsMap['Venda x COF Enviada']} color="green" />
        </div>
      </div>

      {/* ALTERADO: Padding ajustado */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Visão Geral do Funil</h3>
        {/* ALTERADO: Grid ajustado para sm:grid-cols-3 para melhor visualização em tablets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard title="Leads" value={leads} color="orange" small />
            <KpiCard title="Qualificados" value={qualificados} color="cyan" small />
            <KpiCard title="Reuniões Agendadas" value={reunioesAgendadas} color="sky" small />
            <KpiCard title="Reuniões Realizadas" value={reunioesRealizadas} color="yellow" small />
            <KpiCard title="Noshow" value={noshow} color="red" small />
            <KpiCard title="Vendas" value={vendas} color="green" small />
        </div>
      </div>

      {/* ALTERADO: Padding ajustado */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Taxas de Conversão</h3>
        {/* ALTERADO: Grid ajustado para sm:grid-cols-3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard title="Qualificados / Leads" value={taxaQualificadosVsLeads} unit="%" color="cyan" small />
            <KpiCard title="Agendadas / Qualif." value={taxaAgendadosVsQualificados} unit="%" color="sky" small />
            <KpiCard title="Realizadas / Agend." value={taxaRealizadasVsAgendadas} unit="%" color="yellow" small />
            <KpiCard title="Vendas / Realizadas" value={taxaVendasVsRealizadas} unit="%" color="green" small />
            <KpiCard title="Agendadas / Leads" value={taxaAgendadosVsLeads} unit="%" color="orange" small />
            <KpiCard title="Noshow / Agendadas" value={taxaNoshowVsAgendadas} unit="%" color="red" small />
        </div>
      </div>
      
      {/* Estes componentes também podem precisar de ajustes internos para serem responsivos */}
      <WeeklyPerformanceTable data={data} />
      <SdrFunnelChart data={data} />
    </div>
  );
};

export default FunilDeVendasDashboard;
