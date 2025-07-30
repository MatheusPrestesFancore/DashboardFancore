import React from 'react';
import KpiCard from '../components/KpiCard';
import { FileText, FileCheck, DollarSign } from 'lucide-react';

const CloserPerformanceDashboard = ({ data }) => {
  // Nota: Isto assume que as colunas 'Data_COF enviada', 'Data_COF assinada' e 'Data_Venda' existem.
  const realizados = data.filter(d => d['Data_Reunião realizada']).length;
  const cofEnviadas = data.filter(d => d['Data_COF enviada']).length;
  const cofAssinadas = data.filter(d => d['Data_COF assinada']).length;
  const vendas = data.filter(d => d['Data_Venda']).length;

  const taxaEnvioCof = realizados > 0 ? ((cofEnviadas / realizados) * 100).toFixed(2) : 0;
  const taxaAssinaturaCof = cofEnviadas > 0 ? ((cofAssinadas / cofEnviadas) * 100).toFixed(2) : 0;
  const taxaFechamento = cofAssinadas > 0 ? ((vendas / cofAssinadas) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Realizado > COF Enviada" value={taxaEnvioCof} unit="%" icon={<FileText />} color="cyan" />
        <KpiCard title="COF Enviada > COF Assinada" value={taxaAssinaturaCof} unit="%" icon={<FileCheck />} color="green" />
        <KpiCard title="COF Assinada > Venda" value={taxaFechamento} unit="%" icon={<DollarSign />} color="yellow" />
      </div>
      {/* Futuramente, podemos adicionar aqui tabelas e gráficos específicos de Closer */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Análise Detalhada Closer</h3>
          <p className="text-gray-400">Mais gráficos e tabelas de performance de Closer serão adicionados aqui.</p>
      </div>
    </div>
  );
};

export default CloserPerformanceDashboard;