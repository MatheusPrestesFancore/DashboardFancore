import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare, TrendingUp, CheckCircle, UserCheck } from 'lucide-react';
import { KEYWORDS_INTEREST, QUALIFIED_STAGES } from '../utils/helpers';

const AutomationDashboard = ({ data }) => {
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

  // Cálculos existentes
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

  const leadsQualificados = automationLeads.filter(lead => 
    QUALIFIED_STAGES.some(stage => lead[stage] && lead[stage].trim() !== '')
  ).length;

  // Taxas existentes
  const taxaAgendamento = totalLeads > 0 ? ((leadsAgendados / totalLeads) * 100).toFixed(2) : 0;
  const taxaResposta = totalLeads > 0 ? ((leadsComResposta / totalLeads) * 100).toFixed(2) : 0;
  const taxaInteresse = leadsComResposta > 0 ? ((leadsComInteresse / leadsComResposta) * 100).toFixed(2) : 0;
  const taxaQualificacao = totalLeads > 0 ? ((leadsQualificados / totalLeads) * 100).toFixed(2) : 0;

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
      {/* Nenhuma alteração necessária aqui. As classes grid-cols-1 md:grid-cols-2 lg:grid-cols-4 já tornam o grid responsivo. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Taxa de Qualificação (Aut.)" value={taxaQualificacao} unit="%" icon={<UserCheck />} color="sky" />
        <KpiCard title="Taxa de Resposta (Aut.)" value={taxaResposta} unit="%" icon={<MessageSquare />} color="cyan" />
        <KpiCard title="Taxa de Interesse (Aut.)" value={taxaInteresse} unit="%" icon={<TrendingUp />} color="orange" />
        <KpiCard title="Taxa de Agendamento (Aut.)" value={taxaAgendamento} unit="%" icon={<CheckCircle />} color="green" />
      </div>

      {/* ALTERADO: Adicionado padding responsivo (p-4 no mobile, sm:p-6 em telas maiores) */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Funil de Vendas (Automação)</h3>
        <ResponsiveContainer width="100%" height={300}>
          {/* ALTERADO: Margem ajustada para dar mais espaço ao gráfico no celular */}
          <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis type="number" stroke="#9ca3af" />
            {/* ALTERADO: Largura do eixo Y e tamanho da fonte dos rótulos diminuídos para caber em telas pequenas */}
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#9ca3af" 
              width={120} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }} 
              cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#9ca3af' }} />
            {/* ALTERADO: Tamanho da barra ligeiramente reduzido */}
            <Bar dataKey="value" name="Leads" fill="#f97316" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AutomationDashboard;
