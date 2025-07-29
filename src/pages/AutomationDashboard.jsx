import React from 'react'; 
import KpiCard from '../components/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';

const AutomationDashboard = ({ data }) => {
  const totalLeads = data.length;
  const leadsComResposta = data.filter(d => d['Data_Resposta_Msg']).length;
  const leadsAgendados = data.filter(d => d['Agendado']?.toUpperCase() === 'TRUE').length;
  
  const leadsComInteresse = data.reduce((acc, lead) => {
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
    { name: '1. Leads Criados', value: data.length },
    { name: '2. Primeiro Contato', value: data.filter(d => d['Data_Primeiro contato']).length },
    { name: '3. Segundo Contato', value: data.filter(d => d['Data_Segundo contato']).length },
    { name: '4. Terceiro Contato', value: data.filter(d => d['Data_Terceiro contato']).length },
    { name: '5. Quarto Contato', value: data.filter(d => d['Data_Quarto contato']).length },
    { name: '6. Reunião Agendada', value: data.filter(d => d['Data_Reunião agendada']).length },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KpiCard title="Taxa de Agendamento" value={taxaAgendamento} unit="%" icon={<CheckCircle />} color="green" />
        <KpiCard title="Taxa de Resposta" value={taxaResposta} unit="%" icon={<MessageSquare />} color="blue" />
        <KpiCard title="Taxa de Interesse" value={taxaInteresse} unit="%" icon={<TrendingUp />} color="yellow" />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Funil de Vendas (Automação)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis type="number" stroke="#A0AEC0" />
            <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={120} />
            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
            <Legend wrapperStyle={{ color: '#A0AEC0' }} />
            <Bar dataKey="value" name="Leads" fill="#60A5FA" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AutomationDashboard; 
