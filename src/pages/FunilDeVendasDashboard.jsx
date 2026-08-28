import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import GoalGauge from '../components/GoalGauge';
import WeeklyPerformanceTable from '../components/WeeklyPerformanceTable';
// import SdrFunnelChart from '../components/SdrFunnelChart'; // <-- REMOVIDO (O Gráfico feio)
import FunilMensalChart from '../components/FunilMensalChart'; // <-- ADICIONADO (O Gráfico bonito)
import LossReasonChart from '../components/LossReasonChart'; 
import { QUALIFIED_STAGES } from '../utils/helpers';

const FunilDeVendasDashboard = ({ data, goals }) => {
  const goalsMap = useMemo(() => {
    return goals.reduce((acc, goal) => {
      acc[goal.Nome_Meta] = parseFloat(goal.Valor_Meta) || 0;
      return acc;
    }, {});
  }, [goals]);

  // --- CÁLCULOS EXISTENTES (Mantidos) ---
  const leads = data.length;
  const qualificados = data.filter(lead => QUALIFIED_STAGES.some(stage => lead[stage])).length;
  const reunioesAgendadas = data.filter(d => d['Data_Reunião agendada']).length;
  const reunioesRealizadas = data.filter(d => d['Data_Reunião feita']).length;
  const noshow = data.filter(d => d['Data Noshow']).length;
  
  // Assumindo que a 'Data_COF Assinada' representa uma Venda/COF
  const cofAssinadas = data.filter(d => d['Data_COF Assinada']).length; 
  const cofEnviadas = data.filter(d => d['Data_COF Enviada']).length;
  const vendas = data.filter(d => d['Data_Vendas']).length;

  // --- CÁLCULOS DE TAXAS (Mantidos) ---
  const taxaQualificadosVsLeads = leads > 0 ? ((qualificados / leads) * 100).toFixed(2) : 0;
  const taxaAgendadosVsQualificados = qualificados > 0 ? ((reunioesAgendadas / qualificados) * 100).toFixed(2) : 0;
  const taxaRealizadasVsAgendadas = reunioesAgendadas > 0 ? ((reunioesRealizadas / reunioesAgendadas) * 100).toFixed(2) : 0;
  // const taxaVendasVsRealizadas = reunioesRealizadas > 0 ? ((vendas / reunioesRealizadas) * 100).toFixed(2) : 0; // Comentado pois não estava sendo usado visualmente, mas pode manter se quiser
  const taxaAgendadosVsLeads = leads > 0 ? ((reunioesAgendadas / leads) * 100).toFixed(2) : 0;
  const taxaNoshowVsAgendadas = reunioesAgendadas > 0 ? ((noshow / reunioesAgendadas) * 100).toFixed(2) : 0;
  const taxaCofEnviadaVsRealizada = reunioesRealizadas > 0 ? ((cofEnviadas / reunioesRealizadas) * 100).toFixed(2) : 0;
  const taxaCofAssinadaVsCofEnviada = cofEnviadas > 0 ? ((cofAssinadas / cofEnviadas) * 100).toFixed(2) : 0;

  // --- ADAPTAÇÃO PARA O GRÁFICO NOVO ---
  // O componente FunilMensalChart espera um objeto simples com chaves específicas.
  // Vamos criar esse objeto usando os totais que calculamos acima.
  const funnelChartData = {
      Leads: leads,
      Qualificado: qualificados,
      Agendamento: reunioesAgendadas,
      Realizado: reunioesRealizadas,
      "COF assinada": cofAssinadas, // A chave deve ser idêntica à esperada pelo componente
      Venda: vendas
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Metas de Conversão do Funil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GoalGauge title="Agendado x Lead" value={parseFloat(taxaAgendadosVsLeads)} goal={goalsMap['Agendado x Lead']} color="purple" />
          <GoalGauge title="Realizada x Agendada" value={parseFloat(taxaRealizadasVsAgendadas)} goal={goalsMap['Realizada x Agendada']} color="yellow" />
          <GoalGauge title="COF Enviada x Realizada" value={parseFloat(taxaCofEnviadaVsRealizada)} goal={goalsMap['COF Enviada x Realizada']} color="cyan" />
          <GoalGauge title="COF Assinada x COF Enviada" value={parseFloat(taxaCofAssinadaVsCofEnviada)} goal={goalsMap['Venda x COF Enviada']} color="green" />
        </div>
      </div>

      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Visão Geral do Funil</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard title="Leads" value={leads} color="orange" small />
            <KpiCard title="Qualificados" value={qualificados} color="cyan" small />
            <KpiCard title="Reuniões Agendadas" value={reunioesAgendadas} color="sky" small />
            <KpiCard title="Reuniões Realizadas" value={reunioesRealizadas} color="yellow" small />
            <KpiCard title="Noshow" value={noshow} color="red" small />
            <KpiCard title="Vendas" value={vendas} color="green" small />
        </div>
      </div>

      {/* --- AQUI ESTÁ A MUDANÇA PRINCIPAL --- */}
      {/* Removemos o SdrFunnelChart antigo e usamos o novo visual */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Funil de Conversão (Visual)</h3>
        {/* Passamos o objeto adaptado para o componente */}
        <FunilMensalChart selectedMonthData={funnelChartData} />
      </div>
      {/* -------------------------------------- */}

      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Taxas de Conversão</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard title="Qualificados / Leads" value={taxaQualificadosVsLeads} unit="%" color="cyan" small tooltipText="Fórmula: (Qualificados / Leads) * 100" />
            <KpiCard title="Agendadas / Qualif." value={taxaAgendadosVsQualificados} unit="%" color="sky" small tooltipText="Fórmula: (Reuniões Agendadas / Qualificados) * 100" />
            <KpiCard title="Realizadas / Agend." value={taxaRealizadasVsAgendadas} unit="%" color="yellow" small tooltipText="Fórmula: (Reuniões Realizadas / Reuniões Agendadas) * 100" />
            <KpiCard title="Enviadas / Realizadas" value={taxaCofAssinadaVsCofEnviada} unit="%" color="green" small tooltipText="Fórmula: (Vendas / Reuniões Realizadas) * 100" />
            <KpiCard title="Agendadas / Leads" value={taxaAgendadosVsLeads} unit="%" color="orange" small tooltipText="Fórmula: (Reuniões Agendadas / Leads) * 100" />
            <KpiCard title="Noshow / Agendadas" value={taxaNoshowVsAgendadas} unit="%" color="red" small tooltipText="Fórmula: (Noshow / Reuniões Agendadas) * 100" />
        </div>
      </div>
      
      <LossReasonChart data={data} />

      <WeeklyPerformanceTable data={data} />
    </div>
  );
};

export default FunilDeVendasDashboard;