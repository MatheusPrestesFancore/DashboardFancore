import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import { KEYWORDS_INTEREST } from '../utils/helpers';

const AutomationDashboard = ({ data }) => {
  // ... (seu código da página de automação permanece o mesmo)
  const automationLeads = useMemo(() => {
    const automationStages = [
      'Data_Segundo contato',
      'Data_Terceiro contato',
      'Data_Quarto contato',
      'Data_Quinto contato',
      'Data_Contato IA'
    ];
    return data.filter(lead => 
      automationStages.some(stage => lead[stage] && lead[stage].trim() !== '')
    );
  }, [data]);

  const totalLeads = automationLeads.length;
  const leadsComResposta = automationLeads.filter(d => d['Data_Resposta_Msg']).length;
  const leadsAgendados = automationLeads.filter(d => d['Agendado']?.toUpperCase() === 'TRUE').length;
  
  const leadsComInteresse = automationLeads.reduce((acc, lead) => {
    const resposta = lead['Conteudo_Resposta']?.toLowerCase() || '';
    if (KEYWORDS_INTEREST.some(keyword => resposta.includes(keyword))) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const taxaAgendamento = totalLeads > 0 ? ((leadsAgendados / totalLeads) * 100).toFixed(2) : 0;
  const taxaResposta = totalLeads > 0 ? ((leadsComResposta / totalLeads) * 100).toFixed(2) : 0;
  const taxaInteresse = leadsComResposta > 0 ? ((leadsComInteresse / leadsComResposta) * 100).toFixed(2) : 0;

  const funnelData = [
    { name: '1. Leads na Automação', value: totalLeads },
    { name: '2. Terceiro Contato', value: automationLeads.filter(d => d['Data_Terceiro contato']).length },
    { name: '3. Quarto Contato', value: automationLeads.filter(d => d['Data_Quarto contato']).length },
    { name: '4. Quinto Contato', value: automationLeads.filter(d => d['Data_Quinto contato']).length },
    { name: '5. Contato IA', value: automationLeads.filter(d => d['Data_Contato IA']).length },
    { name: '6. Agendados (da Aut.)', value: leadsAgendados },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KpiCard title="Taxa de Agendamento (Aut.)" value={taxaAgendamento} unit="%" icon={<CheckCircle />} color="green" />
        <KpiCard title="Taxa de Resposta (Aut.)" value={taxaResposta} unit="%" icon={<MessageSquare />} color="cyan" />
        <KpiCard title="Taxa de Interesse (Aut.)" value={taxaInteresse} unit="%" icon={<TrendingUp />} color="orange" />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Funil de Vendas (Automação)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" width={140} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} 
              cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            <Bar dataKey="value" name="Leads" fill="#f97316" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AutomationDashboard;