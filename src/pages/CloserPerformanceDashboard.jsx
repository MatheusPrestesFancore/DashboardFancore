import React from 'react';
import KpiCard from '../components/KpiCard';
import CloserEvolutionChart from '../components/CloserEvolutionChart';
import { FileText, FileCheck, DollarSign } from 'lucide-react';

const CloserPerformanceDashboard = ({ data }) => {
  // ... (toda a sua lógica de cálculo permanece a mesma)
  const realizados = data.filter(d => d['Data_Reunião feita']).length;
  const cofEnviadas = data.filter(d => d['Data_COF Enviada']).length;
  const cofAssinadas = data.filter(d => d['Data_COF Assinada']).length;
  const vendas = data.filter(d => d['Data_Venda']).length;

  const taxaEnvioCof = realizados > 0 ? ((cofEnviadas / realizados) * 100).toFixed(2) : 0;
  const taxaAssinaturaCof = cofEnviadas > 0 ? ((cofAssinadas / cofEnviadas) * 100).toFixed(2) : 0;
  const taxaFechamento = cofAssinadas > 0 ? ((vendas / cofAssinadas) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      {/* ALTERADO: Padding ajustado para p-4 em telas pequenas e sm:p-6 em maiores */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Visão Geral - Closer</h3>
        {/* Nenhuma alteração necessária no grid, ele já é responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Reuniões Realizadas" value={realizados} color="yellow" small />
          <KpiCard title="COFs Enviadas" value={cofEnviadas} color="cyan" small />
          <KpiCard title="COFs Assinadas" value={cofAssinadas} color="orange" small />
          <KpiCard title="Vendas" value={vendas} color="green" small />
        </div>
      </div>
      {/* ALTERADO: Padding ajustado para p-4 em telas pequenas e sm:p-6 em maiores */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Taxas de Conversão - Closer</h3>
        {/* Nenhuma alteração necessária no grid, ele já é responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard title="Realizado > COF Enviada" value={taxaEnvioCof} unit="%" icon={<FileText />} color="cyan" />
          <KpiCard title="COF Enviada > COF Assinada" value={taxaAssinaturaCof} unit="%" icon={<FileCheck />} color="orange" />
          <KpiCard title="COF Assinada > Venda" value={taxaFechamento} unit="%" icon={<DollarSign />} color="green" />
        </div>
      </div>
      {/* O componente CloserEvolutionChart também precisará de ajustes internos para ser responsivo, similar ao que fizemos nos outros gráficos. */}
      <CloserEvolutionChart data={data} />
    </div>
  );
};

export default CloserPerformanceDashboard;
