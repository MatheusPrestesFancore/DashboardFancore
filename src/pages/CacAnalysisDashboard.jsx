import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import KpiCard from '../components/KpiCard';
import { DollarSign, Target, TrendingUp, TrendingDown, CircleDollarSign, Trophy } from 'lucide-react';

const CacAnalysisDashboard = ({ data }) => {
    const formatCurrency = (value) => {
        if (typeof value !== 'number') {
            value = parseFloat(value) || 0;
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const totals = useMemo(() => {
        if (!data || data.length === 0) {
            return { investment: 0, leads: 0, sales: 0, cac: 0, cpl: 0, revenue: 0 };
        }
        const investment = data.reduce((sum, row) => sum + row.investment, 0);
        const leads = data.reduce((sum, row) => sum + row.leads, 0);
        const sales = data.reduce((sum, row) => sum + row.sales, 0);
        const revenue = data.reduce((sum, row) => sum + row.revenue, 0);
        const cac = sales > 0 ? investment / sales : 0;
        const cpl = leads > 0 ? investment / leads : 0;
        return { investment, leads, sales, cac, cpl, revenue };
    }, [data]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Investimento Total" value={formatCurrency(totals.investment)} icon={<DollarSign />} color="orange" />
                <KpiCard title="Receita Total" value={formatCurrency(totals.revenue)} icon={<TrendingUp />} color="green" />
                <KpiCard title="Total de Vendas" value={totals.sales.toLocaleString('pt-BR')} icon={<Trophy />} color="sky" />
                <KpiCard title="Total de Leads" value={totals.leads.toLocaleString('pt-BR')} icon={<Target />} color="cyan" />
                <KpiCard title="CAC Médio" value={formatCurrency(totals.cac)} icon={<CircleDollarSign />} color="orange" />
                <KpiCard title="CPL Médio" value={formatCurrency(totals.cpl)} icon={<TrendingDown />} color="red" />
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* --- TÍTULO DO GRÁFICO ATUALIZADO --- */}
                <h3 className="text-lg font-semibold text-white mb-4">Evolução Mensal - Custos vs. Vendas</h3>
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        {/* --- GRÁFICO ATUALIZADO COM SEGUNDO EIXO Y --- */}
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis 
                                yAxisId="left"
                                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                                stroke="#9ca3af" 
                                label={{ value: 'Custo (R$)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#a78bfa"
                                allowDecimals={false}
                                label={{ value: 'Vendas', angle: 90, position: 'insideRight', fill: '#a78bfa' }}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
                                // --- TOOLTIP ATUALIZADO PARA FORMATAR VENDAS ---
                                formatter={(value, name) => {
                                    if (name === 'Vendas') {
                                        return [value, name];
                                    }
                                    return [formatCurrency(value), name];
                                }}
                                cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            <Line yAxisId="left" type="monotone" dataKey="cpl" name="Custo por Lead (CPL)" stroke="#f97316" strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="cac" name="Custo por Cliente (CAC)" stroke="#22d3ee" strokeWidth={2} />
                            {/* --- NOVA LINHA DE VENDAS ADICIONADA --- */}
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
