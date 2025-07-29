import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, MessageSquare, Clock, TrendingUp, CheckCircle, Phone, Mail, User } from 'lucide-react';

// ====================================================================================
// CONFIGURAÇÃO PRINCIPAL - COLE AQUI O URL DA SUA PLANILHA
// Para obter o URL:
// 1. Abra a sua planilha do Google Sheets.
// 2. Vá em "Arquivo" > "Compartilhar" > "Publicar na web".
// 3. Na janela que abrir, selecione a aba "Dashboard_Data".
// 4. No menu suspenso, escolha "Valores separados por vírgula (.csv)".
// 5. Clique em "Publicar" e copie o link gerado.
// ====================================================================================
const GOOGLE_SHEET_CSV_URL = 'COLE_SEU_URL_AQUI';

// Palavras-chave para identificar interesse
const KEYWORDS_INTEREST = ["quero", "vamos", "topo", "agendar", "sim", "tenho interesse", "pode ser", "claro", "gostaria"];

// Componente para os cartões de KPI
const KpiCard = ({ title, value, icon, unit = '', color }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full bg-${color}-500 bg-opacity-20`}>
      {React.cloneElement(icon, { className: `h-8 w-8 text-${color}-400` })}
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white">{value}<span className="text-lg ml-1">{unit}</span></p>
    </div>
  </div>
);

// Componente para o gráfico de funil
const FunnelChart = ({ data }) => {
  const funnelData = [
    { name: '1. Leads Criados', value: data.length },
    { name: '2. Primeiro Contato', value: data.filter(d => d['Data_Primeiro contato']).length },
    { name: '3. Segundo Contato', value: data.filter(d => d['Data_Segundo contato']).length },
    { name: '4. Terceiro Contato', value: data.filter(d => d['Data_Terceiro contato']).length },
    { name: '5. Quarto Contato', value: data.filter(d => d['Data_Quarto contato']).length },
    { name: '6. Reunião Agendada', value: data.filter(d => d['Data_Reunião agendada']).length },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Funil de Vendas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis type="number" stroke="#A0AEC0" />
          <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={120} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
            cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
          />
          <Legend />
          <Bar dataKey="value" name="Leads" fill="#60A5FA" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente para a tabela de leads recentes
const RecentLeadsTable = ({ data }) => {
  const recentLeads = data.slice().sort((a, b) => new Date(b.Data_Criacao) - new Date(a.Data_Criacao)).slice(0, 5);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Responsável</th>
              <th scope="col" className="px-4 py-3">Lead</th>
              <th scope="col" className="px-4 py-3">Etapa Atual</th>
              <th scope="col" className="px-4 py-3">Resposta Recente</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-4 flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <span>{lead['Responsável'] || 'N/D'}</span>
                </td>
                <td className="px-4 py-4 font-medium text-white">{lead['Nome_Lead']}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${lead['Agendado'] === 'TRUE' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {lead['Etapa Atual']}
                  </span>
                </td>
                <td className="px-4 py-4 italic text-gray-500 truncate max-w-xs">{lead['Conteudo_Resposta'] || 'Nenhuma resposta'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Componente principal do App
export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (GOOGLE_SHEET_CSV_URL === 'COLE_SEU_URL_AQUI') {
        setError('Por favor, adicione o URL da sua planilha do Google Sheets na variável GOOGLE_SHEET_CSV_URL.');
        setLoading(false);
        return;
    }

    fetch(GOOGLE_SHEET_CSV_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csvText => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const jsonData = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] ? values[index].trim() : '';
            return obj;
          }, {});
        });
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        setError('Falha ao carregar os dados da planilha. Verifique o URL e as permissões de partilha.');
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Cálculos das métricas
  const totalLeads = data.length;
  const leadsComResposta = data.filter(d => d['Data_Resposta_Msg']).length;
  const leadsAgendados = data.filter(d => d['Agendado'] === 'TRUE').length;
  
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

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Carregando dados...</div>;
  }

  if (error) {
    return <div className="bg-gray-900 text-red-400 min-h-screen flex items-center justify-center p-8 text-center">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard de Vendas</h1>
          <p className="text-gray-400">Análise de performance dos SDRs e automações.</p>
        </header>

        {/* Secção de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KpiCard title="Taxa de Agendamento" value={taxaAgendamento} unit="%" icon={<CheckCircle />} color="green" />
          <KpiCard title="Taxa de Resposta" value={taxaResposta} unit="%" icon={<MessageSquare />} color="blue" />
          <KpiCard title="Taxa de Interesse" value={taxaInteresse} unit="%" icon={<TrendingUp />} color="yellow" />
        </div>

        {/* Secção de Gráficos e Tabelas */}
        <div className="grid grid-cols-1 gap-8">
          <FunnelChart data={data} />
          <RecentLeadsTable data={data} />
        </div>
      </div>
    </div>
  );
}
