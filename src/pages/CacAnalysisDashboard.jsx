import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import KpiCard from '../components/KpiCard';
import { Target, TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react';

const CacAnalysisDashboard = ({ data }) => {
    const formatCurrency = (value) => {
        if (typeof value !== 'number') return 'R$ 0,00';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

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
            {/* --- CORES DOS KPIs ATUALIZADAS PARA LARANJA --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="Investimento Total" value={formatCurrency(totals.investment)} icon={<DollarSign />} color="orange" />
                <KpiCard title="Receita Total" value={formatCurrency(totals.revenue)} icon={<TrendingUp />} color="green" />
                <KpiCard title="Total de Vendas" value={totals.sales.toLocaleString('pt-BR')} icon={<Trophy />} color="sky" />
                <KpiCard title="Total de Leads" value={totals.leads.toLocaleString('pt-BR')} icon={<Target />} color="cyan" />
                <KpiCard title="CAC Médio" value={formatCurrency(totals.cac)} icon={<CircleDollarSign />} color="orange" />
                <KpiCard title="CPL Médio" value={formatCurrency(totals.cpl)} icon={<TrendingDown />} color="red" />
            </div>
            {/* --- CORES DO GRÁFICO ATUALIZADAS PARA LARANJA --- */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Evolução Mensal - CPL vs. CAC</h3>
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis tickFormatter={(value) => `R$${value.toLocaleString('pt-BR')}`} stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} formatter={(value) => formatCurrency(value)} />
                            <Legend wrapperStyle={{ color: '#9ca3af' }} />
                            <Line type="monotone" dataKey="cpl" name="Custo por Lead (CPL)" stroke="#f97316" strokeWidth={2} />
                            <Line type="monotone" dataKey="cac" name="Custo por Cliente (CAC)" stroke="#22d3ee" strokeWidth={2} />
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