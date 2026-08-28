import React, { useMemo } from 'react';
import KpiCard from '../components/KpiCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Target, TrendingUp, TrendingDown, CircleDollarSign, Trophy, BadgeDollarSign, CoinsIcon } from 'lucide-react';

const CacAnalysisDashboard = ({ data }) => {
    const formatCurrency = (value) => {
        if (typeof value !== 'number') {
            value = parseFloat(value) || 0;
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const totals = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                totalInvestment: 0,
                leads: 0,
                sales: 0,
                totalCac: 0,
                cpl: 0,
                revenue: 0,
                mqlAgendadas: 0,
                sqlRealizadas: 0,
                custoMqlAgendadas: 0,
                custoSqlRealizadas: 0,
            };
        }

        const totalInvestment = data.reduce((sum, row) => sum + (row.investment_total || 0), 0);

        // Investimento de marketing não inclui o custo da área.
        // Por isso CPL, Custo por MQL e Custo por SQL ficam estáticos
        // quando o filtro "Incluir Custo da Área" é marcado/desmarcado.
        const marketingInvestment = data.reduce((sum, row) => sum + (row.investment_marketing || 0), 0);

        const leads = data.reduce((sum, row) => sum + (row.leads || 0), 0);
        const sales = data.reduce((sum, row) => sum + (row.sales || 0), 0);
        const revenue = data.reduce((sum, row) => sum + (row.revenue || 0), 0);

        // MQL = Agendamentos
        const mqlAgendadas = data.reduce((sum, row) => sum + (row.mql_agendadas || 0), 0);

        // SQL = Realizados
        const sqlRealizadas = data.reduce((sum, row) => sum + (row.sql_realizadas || 0), 0);

        // CAC usa investimento total, então muda quando inclui custo da área
        const totalCac = sales > 0 ? totalInvestment / sales : 0;

        // CPL, MQL e SQL usam só investimento de marketing, então não mudam com custo da área
        const cpl = leads > 0 ? marketingInvestment / leads : 0;
        const custoMqlAgendadas = mqlAgendadas > 0 ? marketingInvestment / mqlAgendadas : 0;
        const custoSqlRealizadas = sqlRealizadas > 0 ? marketingInvestment / sqlRealizadas : 0;

        return {
            totalInvestment,
            leads,
            sales,
            totalCac,
            cpl,
            revenue,
            mqlAgendadas,
            sqlRealizadas,
            custoMqlAgendadas,
            custoSqlRealizadas,
        };
    }, [data]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                <KpiCard title="Total de Leads" value={totals.leads.toLocaleString('pt-BR')} icon={<Target />} />
                <KpiCard title="Investimento Total" value={formatCurrency(totals.totalInvestment)} icon={<CoinsIcon />} color="pink" />
                <KpiCard title="Receita Total" value={formatCurrency(totals.revenue)} icon={<TrendingUp />} color="green" />
                <KpiCard title="Total de Vendas" value={totals.sales.toLocaleString('pt-BR')} icon={<Trophy />} color="purple" />
                <KpiCard title="Custo por SQL Realizada" value={formatCurrency(totals.custoSqlRealizadas)} icon={<DollarSign />}
                    tooltipClassName="tooltip-shift-right" pointerTooltip color="red" tooltipText="Fórmula: Investimento Total / SQL Realizadas." />
                <KpiCard title="Custo por MQL Agendada" value={formatCurrency(totals.custoMqlAgendadas)} icon={<BadgeDollarSign />}
                    pointerTooltip color="yellow" tooltipText="Fórmula: Investimento Total / MQL Agendadas." />
                <KpiCard
                    title="CAC Médio"
                    value={formatCurrency(totals.totalCac)}
                    icon={<CircleDollarSign />}
                    pointerTooltip
                    color="orange"
                    tooltipText="Custo de Aquisição por Cliente (Geral). Fórmula: Investimento Total / Total de Vendas."
                />
                <KpiCard
                    title="CPL Médio"
                    value={formatCurrency(totals.cpl)}
                    icon={<TrendingDown />}
                    pointerTooltip
                    color="cyan"
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
                                tickFormatter={(value) => `R$${(value / 1000)}k`}
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Custo (R$)', angle: -90, offset: -12, position: 'insideLeft', fill: '#9ca3af' }}

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
                                    if (name === 'Vendas') return [value, name];
                                    return [formatCurrency(value), name];
                                }}
                                cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                            <Line yAxisId="left" type="monotone" dataKey="cpl" name="CPL" stroke="#0082f4" strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="cac" name="CAC" stroke="#ee8f22" strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="custoSqlRealizadas" name="Custo SQL" stroke="#e62e2e" strokeWidth={2} />
                            <Line yAxisId="left" type="monotone" dataKey="custoMqlAgendadas" name="Custo MQL" stroke="#f4d90e" strokeWidth={2} />
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