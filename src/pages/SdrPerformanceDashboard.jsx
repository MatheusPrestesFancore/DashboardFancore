import React from 'react';
import KpiCard from '../components/KpiCard';
import GoalGauge from '../components/GoalGauge'; // Importa o novo componente

// Defina as metas mensais aqui
const META_REUNIOES = 20;
const META_VENDAS = 5;

const SdrPerformanceDashboard = ({ data }) => {
  const leads = data.length;
  const qualificados = data.filter(d => d['Data_Primeiro contato']).length; 
  const reunioesAgendadas = data.filter(d => d['Data_Reunião agendada']).length;
  const reunioesRealizadas = data.filter(d => d['Data_Reunião realizada']).length;
  const vendas = data.filter(d => d['Data_Venda']).length;

  const qualificadoVsLead = leads > 0 ? ((qualificados / leads) * 100).toFixed(2) : 0;
  const agendadoVsQualificado = qualificados > 0 ? ((reunioesAgendadas / qualificados) * 100).toFixed(2) : 0;
  const realizadoVsAgendado = reunioesAgendadas > 0 ? ((reunioesRealizadas / reunioesAgendadas) * 100).toFixed(2) : 0;

  return (
    <>
      {/* NOVA SECÇÃO DE METAS */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Metas do Mês</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GoalGauge title="Reuniões Agendadas" value={reunioesAgendadas} goal={META_REUNIOES} color="purple" />
          <GoalGauge title="Vendas" value={vendas} goal={META_VENDAS} color="green" />
          {/* Adicione mais velocímetros aqui se precisar */}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <KpiCard title="Leads" value={leads} color="blue" small />
          <KpiCard title="Qualificados" value={qualificados} color="cyan" small />
          <KpiCard title="Reuniões Agendadas" value={reunioesAgendadas} color="purple" small />
          <KpiCard title="Reuniões Realizadas" value={reunioesRealizadas} color="yellow" small />
          <KpiCard title="Vendas" value={vendas} color="green" small />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <KpiCard title="Qualificado x Lead" value={qualificadoVsLead} unit="%" color="cyan" small />
          <KpiCard title="Agendado x Qualificado" value={agendadoVsQualificado} unit="%" color="purple" small />
          <KpiCard title="Realizado x Agendado" value={realizadoVsAgendado} unit="%" color="yellow" small />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Funil de Conversão SDR</h3>
          <p className="text-gray-400">Gráfico de funil detalhado para a performance do SDR a ser adicionado aqui.</p>
      </div>
    </>
  );
};

export default SdrPerformanceDashboard;