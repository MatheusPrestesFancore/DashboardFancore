import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { TrendingUp, UserCheck, CalendarCheck, Clock, Users } from 'lucide-react';
import { QUALIFIED_STAGES } from '../utils/helpers';

const SdrPerformanceDashboard = ({ data }) => {
  // ... (seu código da página de performance de SDR permanece o mesmo)
  const parseDate = (dateStr) => {
    const parts = dateStr?.split(' ')[0].split('/');
    if (parts?.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  const leads = data.length;
  const qualificados = data.filter(lead => QUALIFIED_STAGES.some(stage => lead[stage])).length;
  const agendados = data.filter(d => d['Data_Reunião agendada']).length;
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

  const sdrRanking = useMemo(() => {
    const sdrs = {};
    data.forEach(lead => {
      const sdrName = lead['Responsável SDR'];
      if (!sdrName) return;

      if (!sdrs[sdrName]) {
        sdrs[sdrName] = { leads: 0, agendados: 0 };
      }
      sdrs[sdrName].leads += 1;
      if (lead['Data_Reunião agendada']) {
        sdrs[sdrName].agendados += 1;
      }
    });
    return Object.entries(sdrs).map(([name, stats]) => ({
      name,
      ...stats,
      taxa: stats.leads > 0 ? ((stats.agendados / stats.leads) * 100).toFixed(2) : 0,
    })).sort((a, b) => b.agendados - a.agendados);
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Lead > Qualificado" value={taxaQualificacao} unit="%" icon={<UserCheck />} color="cyan" />
        <KpiCard title="Qualificado > Agendado" value={taxaAgendamento} unit="%" icon={<CalendarCheck />} color="orange" />
        <KpiCard title="Agendado > Realizado" value={taxaComparecimento} unit="%" icon={<TrendingUp />} color="yellow" />
        <KpiCard title="Tempo Médio Qualif." value={timeToQualify} unit="dias" icon={<Clock />} color="sky" />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><Users size={20} className="mr-2 text-orange-500"/> Ranking de SDRs (por Agendamentos)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                <tr>
                  <th className="px-4 py-3">Pos.</th>
                  <th className="px-4 py-3">SDR</th>
                  <th className="px-4 py-3 text-center">Leads Trabalhados</th>
                  <th className="px-4 py-3 text-center">Reuniões Agendadas</th>
                  <th className="px-4 py-3 text-center">Taxa de Agend. (%)</th>
                </tr>
              </thead>
              <tbody>
                {sdrRanking.map((sdr, index) => (
                  <tr key={sdr.name} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-4 font-bold text-lg text-white">#{index + 1}</td>
                    <td className="px-4 py-4 font-medium text-white">{sdr.name}</td>
                    <td className="px-4 py-4 text-center">{sdr.leads}</td>
                    <td className="px-4 py-4 text-center text-lg font-bold text-orange-400">{sdr.agendados}</td>
                    <td className="px-4 py-4 text-center font-bold text-cyan-400">{sdr.taxa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default SdrPerformanceDashboard;