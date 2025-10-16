import { useCallback, useMemo } from 'react';
import useAuth from '@hooks/useAuth';
import useFetchCurrency from '@hooks/data/useFetchCurrency';
import useFetchExecutors from '@hooks/data/useFetchExecutors';

import formatDate from '@utils/formatDate';
import { calculateKPI } from '@utils/calculator';
import formatterCurrency from '@utils/formatterCurrency';
import { insTotalCalculator, calculatePercentage } from '@utils/calculator';
import hasRole from '@utils/hasRole';

const useStatisticsTableColumns = () => {
  const { data: executors } = useFetchExecutors();
  const { data: currency } = useFetchCurrency();
  const { user } = useAuth();
  const hasGlobalPermission = useMemo(
    () => hasRole(user, ['Manager', 'CEO']),
    [user]
  );
  const calculateInsTotal = useCallback((column) => {
    return insTotalCalculator({
      paidToDate: column.PaidToDate,
      sumApplied: column.SumApplied,
      insTotal: column.InsTotal,
    });
  }, []);

  const findExecutor = useCallback(
    (column) => {
      if (column.SlpCode === null) return {};
      return (
        executors?.find(
          (executor) => Number(executor.SlpCode) === Number(column.SlpCode)
        ) ?? {}
      );
    },
    [executors]
  );

  const getFormattedSalary = useCallback(
    (column) => {
      const foundExecutor = executors?.find(
        (executor) => executor.SlpCode === column.SlpCode
      );
      let salary = 2000000;
      if (foundExecutor && foundExecutor?.['U_summa']) {
        salary = Number(String(foundExecutor?.['U_summa']).replaceAll(' ', ''));
      }
      return salary;
    },
    [executors]
  );

  const monthlyStatisticsColumns = useMemo(() => [
    {
      key: 'DueDate',
      title: 'Sana',
      width: '2%',
      minWidth: '40px',
      icon: 'calendarFilled',
      renderCell: (column) => {
        return formatDate(column.DueDate, 'YYYY.MM.DD', 'DD.MM.YYYY');
      },
    },
    {
      key: 'InsTotal',
      title: 'Plan',
      width: '2%',
      minWidth: '40px',
      icon: 'calendarFact',
      renderCell: (column) => {
        return formatterCurrency(calculateInsTotal(column), 'USD');
      },
    },
    {
      key: 'SumApplied',
      title: "To'landi",
      width: '2%',
      minWidth: '40px',
      icon: 'income',
      renderCell: (column) => {
        return formatterCurrency(column.SumApplied, 'USD');
      },
    },
    {
      key: 'confiscated',
      title: 'Mahsulot',
      width: '2%',
      minWidth: '40px',
      icon: 'income',
      renderCell: (column) => {
        if (!column.PhoneConfiscated) return '-';
        return formatterCurrency(column.Confiscated, 'USD');
      },
    },
    {
      key: 'percentage',
      title: 'Foiz',
      width: '2%',
      minWidth: '40px',
      icon: 'income',
      renderCell: (column) => {
        const insTotal = calculateInsTotal(column);
        const { value, color } = calculatePercentage(
          column.SumApplied,
          insTotal,
          true
        );
        return <span style={{ color }}>{value}</span>;
      },
    },
  ]);
  const salesPersonStatisticsColumns = useMemo(() => [
    {
      key: 'slpCode',
      title: 'Ijrochi',
      width: '2%',
      minWidth: '40px',
      icon: 'calendarFilled',
      renderCell: (column) => {
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.SlpName) {
          return currentExecutor.SlpName;
        }
        return 'Umumiy';
      },
    },
    {
      key: 'InsTotal',
      title: 'Plan',
      width: '2%',
      minWidth: '40px',
      icon: 'calendarFact',
      renderCell: (column) => {
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.['U_role'] === 'Manager' && !hasGlobalPermission) {
          return '-';
        }

        return formatterCurrency(calculateInsTotal(column), 'USD');
      },
    },
    {
      key: 'SumApplied',
      title: 'Fakt',
      width: '2%',
      minWidth: '40px',
      icon: 'income',
      renderCell: (column) => {
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.['U_role'] === 'Manager' && !hasGlobalPermission) {
          return '-';
        }

        return formatterCurrency(column.SumApplied, 'USD');
      },
    },
    {
      key: 'percentage',
      title: 'Foiz',
      width: '2%',
      minWidth: '40px',
      icon: 'income',
      renderCell: (column) => {
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.['U_role'] === 'Manager' && !hasGlobalPermission) {
          return '-';
        }
        const insTotal = calculateInsTotal(column);
        return calculatePercentage(column.SumApplied, insTotal);
      },
    },
    {
      key: 'kpi',
      title: 'KPI',
      width: '2%',
      minWidth: '40px',
      icon: 'moneyAdd',
      renderCell: (column) => {
        if (column.SlpCode === null) return '-';
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.['U_role'] === 'Manager' && !hasGlobalPermission) {
          return '-';
        }
        const insTotal = calculateInsTotal(column);
        const percentage = ((column.SumApplied / insTotal) * 100).toFixed(2);
        const kpi = calculateKPI(
          percentage,
          column.SumApplied,
          currentExecutor?.['U_role']
        );
        return formatterCurrency(kpi, 'USD');
      },
    },
    {
      key: 'kpiUZS',
      title: 'KPI (UZS)',
      width: '2%',
      minWidth: '100px',
      icon: 'moneyAdd',
      renderCell: (column) => {
        console.log(column, 'column');
        if (column.SlpCode === null) return '-';
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.['U_role'] === 'Manager' && !hasGlobalPermission) {
          return '-';
        }
        const insTotal = calculateInsTotal(column);
        const percentage = ((column.SumApplied / insTotal) * 100).toFixed(2);
        const kpi = calculateKPI(
          percentage,
          column.SumApplied,
          currentExecutor?.['U_role']
        );
        return formatterCurrency(kpi * (currency?.Rate || 1), 'UZS');
      },
    },
    {
      key: 'salary',
      title: 'Oylik (fiksa)',
      width: '2%',
      minWidth: '120px',
      icon: 'income',
      renderCell: (column) => {
        if (column.SlpCode === null) return '-';
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.['U_role'] === 'Manager' && !hasGlobalPermission) {
          return '-';
        }
        const salary = getFormattedSalary(column);
        return formatterCurrency(salary);
      },
    },
    {
      key: 'calculatedSalary',
      title: 'Jami oylik',
      width: '2%',
      minWidth: '40px',
      icon: 'income',
      renderCell: (column) => {
        if (column.SlpCode === null) return '-';
        const currentExecutor = findExecutor(column);
        if (currentExecutor?.['U_role'] === 'Manager' && !hasGlobalPermission) {
          return '-';
        }
        const salary = getFormattedSalary(column);
        const insTotal = calculateInsTotal(column);
        const percentage = ((column.SumApplied / insTotal) * 100).toFixed(2);
        const kpi = calculateKPI(
          percentage,
          column.SumApplied,
          currentExecutor['U_role']
        );
        const kpiUZS = kpi * (currency?.Rate || 1);
        const calculatedSalary = salary + kpiUZS;
        return formatterCurrency(calculatedSalary);
      },
    },
  ]);

  return { monthlyStatisticsColumns, salesPersonStatisticsColumns };
};

export default useStatisticsTableColumns;
