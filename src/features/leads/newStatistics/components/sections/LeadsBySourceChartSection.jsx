import { Card, Col, Row } from '@/components/ui';
import { DateInput } from '@/components/shadcn/ui/date-input';
import useSelectorValue from '../../hooks/useSelectorValue';
import moment from 'moment';
import { setNewStatisticsSectionFilter } from '@/store/slices/newStatisticsSlice';
import { useDispatch } from 'react-redux';
import EChart from '@/components/shared/EChart';
import { mockSourceTrendData } from '../../utils/mockData';

const today = moment().format('YYYY-MM-DD');

export default function LeadsBySourceChartSection() {
    const title = "Manbalar bo'yicha leadlarning ko'rsatkichlari";
    const date = useSelectorValue('sectionFilters.bySourceDate', today);
    const dispatch = useDispatch();
    const handleDateChange = (date) => {
        dispatch(setNewStatisticsSectionFilter({ bySourceDate: date }));
    };

    const rightTitle = <DateInput value={date} onChange={handleDateChange} />;

    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'var(--primary-bg)',
            borderColor: 'var(--primary-border-color)',
            textStyle: { color: 'var(--chart-text-color)', fontSize: 13 },
        },
        legend: {
            data: mockSourceTrendData.series.map((s) => s.name),
            bottom: 0,
            textStyle: { color: 'var(--chart-legend-color)', fontSize: 13 },
        },
        grid: {
            left: '3%',
            right: '3%',
            top: '8%',
            bottom: '15%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: mockSourceTrendData.dates,
            boundaryGap: false,
            axisLine: { lineStyle: { color: 'var(--chart-grid-color)' } },
            axisLabel: { color: 'var(--chart-axis-label-color)', fontSize: 12 },
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: 'var(--chart-grid-color)', type: 'dashed' } },
            axisLabel: { color: 'var(--chart-axis-label-color)', fontSize: 12 },
        },
        series: mockSourceTrendData.series.map((s) => ({
            name: s.name,
            type: 'line',
            smooth: true,
            data: s.data,
            z: 10,
            zlevel: 1,
            itemStyle: { color: s.color },
            lineStyle: { width: 3, color: s.color, opacity: 1 },
            areaStyle: { color: s.color, opacity: 0.05 },
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: true,
        })),
    };

    return (
        <Card title={title} rightTitle={rightTitle}>
            <Row align="stretch">
                <Col fullWidth style={{ minWidth: 0 }}>
                    <EChart option={option} height={350} />
                </Col>
            </Row>
        </Card>
    );
}
