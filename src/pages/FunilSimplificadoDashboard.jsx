// src/pages/FunilSimplificadoDashboard.jsx
// ATUALIZADO: Remoção da duplicidade visual (controle passado via props para o FunilMonthFilter)

import React, { useState, useMemo, useEffect } from 'react';
// Componentes do Dashboard
import FunilMonthFilter from '../components/FunilMonthFilter';
import KpiCard from '../components/KpiCard';
import FunilMensalChart from '../components/FunilMensalChart';

// Função para converter "17,97%" ou "0,1797" para 17.97
const parsePercent = (value) => {
  if (typeof value !== 'string') return 0;
  const cleanValue = value.replace(',', '.');
  const num = parseFloat(cleanValue.replace('%', '').trim()) || 0;
  if (num > 1) return num;
  if (num > 0 && num <= 1) return num * 100;
  return num;
};

const monthOrder = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const FunilSimplificadoDashboard = ({ data }) => {
  // 1. Estado do Ano e Período
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedPeriodType, setSelectedPeriodType] = useState('month'); // 'quarter' | 'year' | 'custom'
  const [selectedPeriodValue, setSelectedPeriodValue] = useState(null); // quarter number, 'all', or null for custom
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [firstSelection, setFirstSelection] = useState(null);

  // 2. Extrai os anos únicos disponíveis nos dados
  const uniqueYears = useMemo(() => {
    if (!data) return [];
    const years = new Set(data.map(d => d.Ano && parseInt(d.Ano, 10)).filter(Boolean));
    return Array.from(years).sort((a, b) => a - b);
  }, [data]);

  // Corrige o ano selecionado caso ele não esteja na lista
  useEffect(() => {
    if (uniqueYears.length > 0 && !uniqueYears.includes(selectedYear)) {
      setSelectedYear(uniqueYears[uniqueYears.length - 1]);
    }
  }, [uniqueYears, selectedYear]);

  // 3. Filtra os dados pelo Ano selecionado
  const yearData = useMemo(() => {
    if (!data) return [];
    return data.filter(d => d.Ano && parseInt(d.Ano, 10) === selectedYear);
  }, [data, selectedYear]);

  // Extrai os meses disponíveis nos dados do ano selecionado
  const availableMonths = useMemo(() => {
    if (!yearData) return [];
    return [...new Set(yearData.map(d => d.Mês).filter(Boolean))];
  }, [yearData]);

  // Efeito para atualizar o período selecionado por padrão quando muda o ano
  useEffect(() => {
    if (yearData.length > 0) {
      if (selectedPeriodType === 'quarter') {
        const { start, end } = {
          1: { start: 'Janeiro', end: 'Março' },
          2: { start: 'Abril', end: 'Junho' },
          3: { start: 'Julho', end: 'Setembro' },
          4: { start: 'Outubro', end: 'Dezembro' }
        }[selectedPeriodValue] || { start: 'Janeiro', end: 'Março' };
        setStartMonth(start);
        setEndMonth(end);
      } else if (selectedPeriodType === 'year') {
        const sortedAvailable = [...availableMonths].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
        if (sortedAvailable.length > 0) {
          setStartMonth(sortedAvailable[0]);
          setEndMonth(sortedAvailable[sortedAvailable.length - 1]);
        }
      } else {
        // Se for custom (ou no carregamento inicial), escolhemos o último mês disponível ou o mês atual
        if (!startMonth || !endMonth || !availableMonths.includes(startMonth)) {
          const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          
          const hoje = new Date();
          let prevMonthIndex = hoje.getMonth() - 1;
          let prevMonthYear = hoje.getFullYear();
          if (prevMonthIndex < 0) {
            prevMonthIndex = 11;
            prevMonthYear -= 1;
          }

          const mesAnterior = meses[prevMonthIndex];
          let defaultMonth = null;

          if (selectedYear === prevMonthYear) {
            const mesAnteriorExiste = yearData.find(d => d.Mês === mesAnterior);
            if (mesAnteriorExiste) {
              defaultMonth = mesAnterior;
            }
          }

          if (!defaultMonth && yearData.length > 0) {
            defaultMonth = yearData[yearData.length - 1].Mês;
          }

          if (defaultMonth) {
            setSelectedPeriodType('custom');
            setStartMonth(defaultMonth);
            setEndMonth(defaultMonth);
            setFirstSelection(null);
          }
        }
      }
    } else {
      setStartMonth(null);
      setEndMonth(null);
    }
  }, [selectedYear, yearData]);

  // Consolida os dados de acordo com o intervalo startMonth e endMonth selecionados
  const selectedPeriodData = useMemo(() => {
    if (yearData.length === 0 || !startMonth || !endMonth) return null;

    const startIndex = monthOrder.indexOf(startMonth);
    const endIndex = monthOrder.indexOf(endMonth);

    const rowsToConsolidate = yearData.filter(d => {
      const currentIndex = monthOrder.indexOf(d.Mês);
      return currentIndex >= startIndex && currentIndex <= endIndex;
    });

    if (rowsToConsolidate.length === 0) return null;

    // Se selecionamos exatamente um mês e temos os dados diretamente dele,
    // podemos usar a linha do dataset para manter os dados idênticos, inclusive strings.
    if (rowsToConsolidate.length === 1) {
      return rowsToConsolidate[0];
    }

    const consolidated = {
      Leads: 0,
      Qualificado: 0,
      Agendamento: 0,
      Realizado: 0,
      'COF assinada': 0,
      'Total de vendas': 0,
      Venda: 0,
      Placa: 0,
      Rede: 0,
      'LP IA': 0,
    };

    rowsToConsolidate.forEach(row => {
      consolidated.Leads += parseInt(row.Leads || 0, 10);
      consolidated.Qualificado += parseInt(row.Qualificado || 0, 10);
      consolidated.Agendamento += parseInt(row.Agendamento || 0, 10);
      consolidated.Realizado += parseInt(row.Realizado || 0, 10);
      consolidated['COF assinada'] += parseInt(row['COF assinada'] || 0, 10);
      consolidated['Total de vendas'] += parseInt(row['Total de vendas'] || 0, 10);
      consolidated.Venda += parseInt(row.Venda || 0, 10);
      consolidated.Placa += parseInt(row.Placa || 0, 10);
      consolidated.Rede += parseInt(row.Rede || 0, 10);
      consolidated['LP IA'] += parseInt(row['LP IA'] || 0, 10);
    });

    // Recalcula taxas de conversão para o período consolidado (em porcentagem)
    consolidated['Qualificado X Leads'] = consolidated.Leads > 0 ? (consolidated.Qualificado / consolidated.Leads) * 100 : 0;
    consolidated['Agendado X Leads'] = consolidated.Leads > 0 ? (consolidated.Agendamento / consolidated.Leads) * 100 : 0;
    consolidated['Realizado X Agendado'] = consolidated.Agendamento > 0 ? (consolidated.Realizado / consolidated.Agendamento) * 100 : 0;
    consolidated['COF Assinada X Venda'] = consolidated['COF assinada'] > 0 ? (consolidated['Total de vendas'] / consolidated['COF assinada']) * 100 : 0;

    return consolidated;
  }, [yearData, startMonth, endMonth]);

  // Função auxiliar para formatar a taxa de conversão (seja string ou número)
  const getConversionRate = (key) => {
    if (!selectedPeriodData) return 0;
    const val = selectedPeriodData[key];
    if (typeof val === 'number') {
      return val;
    }
    return parsePercent(val);
  };

  // Formata o título do período selecionado
  const getPeriodTitle = () => {
    if (selectedPeriodType === 'quarter') {
      return `${selectedPeriodValue}º Trimestre (${selectedYear})`;
    }
    if (selectedPeriodType === 'year') {
      return `Ano Todo (${selectedYear})`;
    }
    if (selectedPeriodType === 'custom') {
      if (startMonth === endMonth) {
        return `${startMonth || 'N/A'} (${selectedYear})`;
      }
      return `${startMonth} a ${endMonth} (${selectedYear})`;
    }
    return `(${selectedYear})`;
  };

  return (
    <div className="space-y-8">

      {/* 1. FILTRO DE MÊS E ANO COM LAYOUT DO CAC */}
      <FunilMonthFilter
        availableMonths={availableMonths}
        selectedPeriodType={selectedPeriodType}
        setSelectedPeriodType={setSelectedPeriodType}
        selectedPeriodValue={selectedPeriodValue}
        setSelectedPeriodValue={setSelectedPeriodValue}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        uniqueYears={uniqueYears}
        startMonth={startMonth}
        setStartMonth={setStartMonth}
        endMonth={endMonth}
        setEndMonth={setEndMonth}
        firstSelection={firstSelection}
        setFirstSelection={setFirstSelection}
      />

      {/* 2. KPIs DO PERÍODO SELECIONADO */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          KPIs do Período: {getPeriodTitle()}
        </h3>

        {selectedPeriodData ? (
          <>
            {/* KPIs de Valor */}
            <h4 className="text-md font-medium text-gray-300 mb-3">Valores Absolutos</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <KpiCard title="Leads" value={parseInt(selectedPeriodData.Leads || 0, 10)} color="orange" small />
              <KpiCard title="Qualificados" value={parseInt(selectedPeriodData.Qualificado || 0, 10)} color="cyan" small />
              <KpiCard title="Agendamentos" value={parseInt(selectedPeriodData.Agendamento || 0, 10)} color="sky" small />
              <KpiCard title="Realizados" value={parseInt(selectedPeriodData.Realizado || 0, 10)} color="yellow" small />
              <KpiCard title="COF Assinada" value={parseInt(selectedPeriodData['COF assinada'] || 0, 10)} color="purple" small />
              <KpiCard title="Total de Vendas" value={parseInt(selectedPeriodData['Total de vendas'] || 0, 10)} color="pink" small />
            </div>

            {/* KPIs de Taxas */}
            <h4 className="text-md font-medium text-gray-300 mb-3">Taxas de Conversão</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard title="Qualificado X Leads" value={getConversionRate('Qualificado X Leads').toFixed(2)} unit="%" color="cyan" small />
              <KpiCard title="Agendado X Leads" value={getConversionRate('Agendado X Leads').toFixed(2)} unit="%" color="sky" small />
              <KpiCard title="Realizado X Agend." value={getConversionRate('Realizado X Agendado').toFixed(2)} unit="%" color="yellow" small />
              <KpiCard title="COF Assinada X Venda" value={getConversionRate('COF Assinada X Venda').toFixed(2)} unit="%" color="green" small />
            </div>

            {/* Origem das Vendas */}
            {(() => {
              const origens = [
                { key: 'Venda', color: 'green' },
                { key: 'Placa', color: 'blue' },
                { key: 'Rede', color: 'indigo' },
                { key: 'LP IA', color: 'teal' }
              ];

              const kpisOrigem = origens.map(origem => {
                const value = parseInt(selectedPeriodData[origem.key] || 0, 10);
                return value > 0 ? (
                  <KpiCard key={origem.key} title={origem.key} value={value} color={origem.color} small />
                ) : null;
              }).filter(Boolean);

              return (
                <>
                  <h4 className="text-md font-medium text-gray-300 mb-3 mt-6">Origem das Vendas (Período)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                    {kpisOrigem.length > 0 ? (
                      kpisOrigem
                    ) : (
                      <p className="text-gray-500 text-sm col-span-full">
                        Nenhuma venda registrada para Venda, Placa, Rede ou LP IA neste período.
                      </p>
                    )}
                  </div>
                </>
              );
            })()}
          </>
        ) : (
          <p className="text-gray-400">
            {yearData.length === 0
              ? `Sem dados encontrados para o ano de ${selectedYear}. Verifique se a coluna "Ano" está preenchida na planilha.`
              : 'Selecione um período para ver os detalhes.'}
          </p>
        )}
      </div>

      {/* 3. GRÁFICO DE FUNIL */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Funil de Conversão ({getPeriodTitle()})
        </h3>
        <FunilMensalChart selectedMonthData={selectedPeriodData} />
      </div>

    </div>
  );
};

export default FunilSimplificadoDashboard;