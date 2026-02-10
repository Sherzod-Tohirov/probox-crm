import { Card, Col, Row } from '@/components/ui';
import EChart from '@/components/shared/EChart';
import { mockLeadsByTimeData } from '../../utils/mockData';

function resolveCssVar(name, fallback) {
    if (typeof window === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    return value || fallback;
}

export default function LeadsByTimeChartSection() {
    const title = "Lead tuzilgan vaqt bo'yicha ko'rsatkichlar";
    const primarySeries = mockLeadsByTimeData.series[0];
    const axisLabelColor = resolveCssVar('--chart-axis-label-color', '#5e6d86');
    const gridColor = resolveCssVar('--chart-grid-color', '#d9e1ec');
    const accent = resolveCssVar('--chart-accent-success', '#16a34a') || '#16a34a';
    const accentStrong =
        resolveCssVar('--chart-accent-success-strong', 'rgba(34, 197, 94, 0.45)') ||
        'rgba(34, 197, 94, 0.45)';
    const accentSoft =
        resolveCssVar('--chart-accent-success-soft', 'rgba(34, 197, 94, 0.05)') ||
        'rgba(34, 197, 94, 0.05)';

    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'var(--primary-bg)',
            borderColor: 'var(--primary-border-color)',
            textStyle: { color: 'var(--chart-text-color)', fontSize: 13 },
        },
        grid: {
            left: '3%',
            right: '3%',
            top: '8%',
            bottom: '7%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: mockLeadsByTimeData.hours,
            boundaryGap: false,
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisLabelColor, fontSize: 12 },
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
            axisLabel: { color: axisLabelColor, fontSize: 12 },
        },
        series: [
            {
                name: primarySeries?.name || 'Leadlar',
                type: 'line',
                smooth: true,
                data: primarySeries?.data || [],
                z: 10,
                zlevel: 1,
                itemStyle: { color: accent },
                lineStyle: { width: 2.5, color: accent },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: accentStrong },
                            { offset: 1, color: accentSoft },
                        ],
                    },
                },
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: true,
            },
        ],
    };

    return (
        <Card title={title}>
            <Row align="stretch">
                <Col fullWidth style={{ minWidth: 0 }}>
                    <EChart option={option} height={350} />
                </Col>
            </Row>
        </Card>
    );
}
