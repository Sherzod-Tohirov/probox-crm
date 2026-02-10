import { Card, Col, Row } from '@/components/ui';
import { useState } from 'react';
import EChart from '@/components/shared/EChart';
import { mockLeadsByDateData } from '../../utils/mockData';
import {
  ButtonGroup,
  ButtonGroupItem,
} from '@/components/shadcn/ui/button-group';
import { Select, SelectOption } from '@/components/shadcn/ui/select';

function resolveCssVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

export default function LeadsByDateChartSection() {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedBranch, setSelectedBranch] = useState('parkent');
  const [selectedMonth, setSelectedMonth] = useState('dekabr');
  const [selectedYear, setSelectedYear] = useState('2025');
  const title = "Lead tuzilgan kun bo'yicha ko'rsatkichlar";

  const activeSeries = mockLeadsByDateData.series[activeTab]?.[0];
  const chartData = activeSeries?.data || [];
  const yMax = Math.max(...chartData, 0);
  const yAxisMax = Math.ceil((yMax + 20) / 50) * 50;
  const axisLabelColor = resolveCssVar('--chart-axis-label-color', '#5e6d86');
  const gridColor = resolveCssVar('--chart-grid-color', '#d9e1ec');
  const accent = resolveCssVar('--chart-accent-primary', '#17aee5') || '#17aee5';
  const accentStrong =
    resolveCssVar('--chart-accent-primary-strong', 'rgba(23, 174, 229, 0.35)') ||
    'rgba(23, 174, 229, 0.35)';
  const accentSoft =
    resolveCssVar('--chart-accent-primary-soft', 'rgba(23, 174, 229, 0.05)') ||
    'rgba(23, 174, 229, 0.05)';

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'var(--primary-bg)',
      borderColor: 'var(--primary-border-color)',
      textStyle: { color: 'var(--chart-text-color)', fontSize: 14 },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: accentStrong,
                },
            },
    },
    grid: {
      left: '2.5%',
      right: '1.5%',
      top: '4%',
      bottom: '17%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: mockLeadsByDateData.dates,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: { color: gridColor, type: 'dashed' },
      },
      axisLabel: { color: axisLabelColor, fontSize: 14, margin: 14 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: yAxisMax,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: gridColor, type: 'dashed' },
      },
      axisLabel: { color: axisLabelColor, fontSize: 14, margin: 12 },
    },
    series: [
      {
        name: activeSeries?.name || 'Leadlar',
        type: 'line',
        data: chartData,
        smooth: 0.35,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        z: 10,
        zlevel: 1,
        lineStyle: {
          color: accent,
          width: 4,
          opacity: 1,
        },
                areaStyle: {
                    color: {
                        type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: accentStrong },
                            { offset: 1, color: accentSoft },
                        ],
                    },
                },
        itemStyle: {
          color: accent,
          borderColor: accent,
          borderWidth: 1,
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  };

  return (
    <Card
      title={title}
      rightTitle={
        <div className="flex items-center gap-8">
          <Select
            value={selectedBranch}
            onChange={setSelectedBranch}
            className="w-[170px]"
          >
            <SelectOption value="parkent">Parkent</SelectOption>
            <SelectOption value="sagbon">Sag&apos;bon</SelectOption>
            <SelectOption value="qoratosh">Qoratosh</SelectOption>
          </Select>
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="w-[170px]"
          >
            <SelectOption value="yanvar">Yanvar</SelectOption>
            <SelectOption value="fevral">Fevral</SelectOption>
            <SelectOption value="mart">Mart</SelectOption>
            <SelectOption value="aprel">Aprel</SelectOption>
            <SelectOption value="may">May</SelectOption>
            <SelectOption value="iyun">Iyun</SelectOption>
            <SelectOption value="iyul">Iyul</SelectOption>
            <SelectOption value="avgust">Avgust</SelectOption>
            <SelectOption value="sentabr">Sentabr</SelectOption>
            <SelectOption value="oktabr">Oktabr</SelectOption>
            <SelectOption value="noyabr">Noyabr</SelectOption>
            <SelectOption value="dekabr">Dekabr</SelectOption>
          </Select>
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            className="w-[130px]"
          >
            <SelectOption value="2024">2024</SelectOption>
            <SelectOption value="2025">2025</SelectOption>
            <SelectOption value="2026">2026</SelectOption>
          </Select>
        </div>
      }
    >
      <Row align="stretch">
        <Col fullWidth style={{ minWidth: 0 }}>
          <EChart option={option} height={420} />
        </Col>
        <Col fullWidth style={{ minWidth: 0 }}>
          <div className="w-full mt-8 flex justify-center">
            <ButtonGroup className="w-full max-w-[980px]">
              {mockLeadsByDateData.tabs.map((tab) => (
                <ButtonGroupItem
                  key={tab.key}
                  active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1"
                >
                  {tab.label}
                </ButtonGroupItem>
              ))}
            </ButtonGroup>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
