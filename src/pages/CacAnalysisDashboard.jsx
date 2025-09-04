import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Target, TrendingUp, TrendingDown, CircleDollarSign, Trophy, Megaphone } from 'lucide-react';

const CacAnalysisDashboard = ({ data }) => {
    const formatCurrency = (value) => {
        if (typeof value !== 'number') {
            value = parseFloat(value) || 0;
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const totals = useMemo(() => {
        if (!data || data.length === 0) {
            return { totalInvestment: 0, marketingInvestment: 0, leads: 0, sales: 0, totalCac: 0, marketingCac: 0, cpl: 0, revenue: 0 };
        }
        
        const totalInvestment = data.reduce((sum, row) => sum + (row.investment_total || 0), 0);
        const marketingInvestment = data.reduce((sum, row) => sum + (row.investment_marketing || 0), 0);
        
        const leads = data.reduce((sum, row) => sum + row.leads, 0);
        const sales = data.reduce((sum, row) => sum + row.sales, 0);
        const revenue = data.reduce((sum, row) => sum + row.revenue, 0);

        const totalCac = sales > 0 ? totalInvestment / sales : 0;
        const marketingCac = sales > 0 ? marketingInvestment / sales : 0;
        const cpl = sales > 0 ? marketingInvestment / leads : 0;
        
        return { totalInvestment, marketingInvestment, leads, sales, totalCac, marketingCac, cpl, revenue };
    }, [data]);

    return (
        <div className="space-y-8">
            {/* ALTERADO: As classes do grid foram ajustadas para dar mais espaço aos cards. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <KpiCard title="Investimento Total" value={formatCurrency(totals.totalInvestment)} icon={<DollarSign />} color="orange" />
                <KpiCard title="Investimento Marketing" value={formatCurrency(totals.marketingInvestment)} icon={<Megaphone />} color="purple" />
                <KpiCard title="Receita Total" value={formatCurrency(totals.revenue)} icon={<TrendingUp />} color="green" />
                <KpiCard title="Total de Vendas" value={totals.sales.toLocaleString('pt-BR')} icon={<Trophy />} color="sky" />
                <KpiCard title="Total de Leads" value={totals.leads.toLocaleString('pt-BR')} icon={<Target />} color="cyan" />
                
                <KpiCard 
                  title="CAC Médio" 
                  value={formatCurrency(totals.totalCac)} 
                  icon={<CircleDollarSign />} 
                  color="orange" 
                  tooltipText="Custo de Aquisição por Cliente (Geral). Fórmula: Investimento Total / Total de Vendas."
                />
                
                <KpiCard 
                  title="CAC Marketing" 
                  value={formatCurrency(totals.marketingCac)} 
                  icon={<CircleDollarSign />} 
                  color="purple"
                  tooltipText="Custo de Aquisição por Cliente (Marketing). Fórmula: Investimento Marketing / Total de Vendas."
                />
                
                <KpiCard 
                  title="CPL Médio" 
                  value={formatCurrency(totals.cpl)} 
                  icon={<TrendingDown />} 
                  color="red"
                  tooltipText="Custo por Lead (Geral). Fórmula: Investimento Total / Total de Leads."
                />
            </div>
            
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Evolução Mensal - Custos vs. Vendas</h3>
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                            <YAxis 
                                yAxisId="left"
                                tickFormatter={(value) => `R$${(value/1000)}k`}
                                stroke="#9ca3af" 
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Custo (R$)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#a78bfa"
                                allowDecimals={false}
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Vendas', angle: 90, position: 'insideRight', fill: '#a78bfa' }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
                                formatter={(value, name) => {
                                    if (name === 'Vendas') {
                                        return [value, name];
                                    }
                                    return [formatCurrency(value), name];
                                }}
                                cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                            <Line yAxisId="left" type="monotone" dataKey="cpl" name="CPL" stroke="#f97316" strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="cac" name="CAC" stroke="#22d3ee" strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="investment_marketing" name="Custo MKT" stroke="#facc15" strokeWidth={2} />
                            <Line yAxisId="right" type="monotone" dataKey="sales" name="Vendas" stroke="#a78bfa" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center py-10">Sem dados para exibir no período selecionado.</p>
                )}
            </div>
        </div>
    );
};

export default CacAnalysisDashboard;

