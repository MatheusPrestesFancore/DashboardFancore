import React from 'react';
import KpiCard from '../components/KpiCard';
import { TrendingUp, UserCheck, CalendarCheck } from 'lucide-react';

const SdrPerformanceDashboard = ({ data }) => {
  const leads = data.length;
  const qualificados = data.filter(d => d['Data_Primeiro contato']).length;
  const agendados = data.filter(d => d['Data_Reunião agendada']).length;
  const realizados = data.filter(d => d['Data_Reunião realizada']).length;

  const taxaQualificacao = leads > 0 ? ((qualificados / leads) * 100).toFixed(2) : 0;
  const taxaAgendamento = qualificados > 0 ? ((agendados / qualificados) * 100).toFixed(2) : 0;
  const taxaComparecimento = agendados > 0 ? ((realizados / agendados) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Lead > Qualificado" value={taxaQualificacao} unit="%" icon={<UserCheck />} color="cyan" />
        <KpiCard title="Qualificado > Agendado" value={taxaAgendamento} unit="%" icon={<CalendarCheck />} color="purple" />
        <KpiCard title="Agendado > Realizado" value={taxaComparecimento} unit="%" icon={<TrendingUp />} color="yellow" />
      </div>
      {/* Futuramente, podemos adicionar aqui tabelas e gráficos específicos de SDR, como ranking */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Análise Detalhada SDR</h3>
          <p className="text-gray-400">Mais gráficos e tabelas de performance de SDR serão adicionados aqui.</p>
      </div>
    </div>
  );
};

export default SdrPerformanceDashboard;