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
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Visão Geral - Closer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Reuniões Realizadas" value={realizados} color="yellow" small />
          <KpiCard title="COFs Enviadas" value={cofEnviadas} color="cyan" small />
          <KpiCard title="COFs Assinadas" value={cofAssinadas} color="orange" small />
          <KpiCard title="Vendas" value={vendas} color="green" small />
        </div>
      </div>
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Taxas de Conversão - Closer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ALTERADO: Adicionado tooltipText com a fórmula */}
          <KpiCard 
            title="Realizado > COF Enviada" 
            value={taxaEnvioCof} 
            unit="%" 
            icon={<FileText />} 
            color="cyan" 
            tooltipText="Percentual de reuniões realizadas que resultaram no envio de uma COF. Fórmula: (COFs Enviadas / Reuniões Realizadas) * 100."
          />
          {/* ALTERADO: Adicionado tooltipText com a fórmula */}
          <KpiCard 
            title="COF Enviada > COF Assinada" 
            value={taxaAssinaturaCof} 
            unit="%" 
            icon={<FileCheck />} 
            color="orange" 
            tooltipText="Percentual de COFs enviadas que foram assinadas. Fórmula: (COFs Assinadas / COFs Enviadas) * 100."
          />
          {/* ALTERADO: Adicionado tooltipText com a fórmula */}
          <KpiCard 
            title="COF Assinada > Venda" 
            value={taxaFechamento} 
            unit="%" 
            icon={<DollarSign />} 
            color="green" 
            tooltipText="Percentual de COFs assinadas que se converteram em vendas. Fórmula: (Vendas / COFs Assinadas) * 100."
          />
        </div>
      </div>
      <CloserEvolutionChart data={data} />
    </div>
  );
};

export default CloserPerformanceDashboard;

