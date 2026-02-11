import { Card, Col, Row } from '@/components/ui';
import EChart from '@/components/shared/EChart';

const sourceRingData = [
  { name: 'Meta', value: 5254, color: '#ef4444' },
  { name: "Qo'ng'iroq", value: 1307, color: '#0f83bd' },
  { name: 'Community', value: 928, color: '#7c3aed' },
  { name: 'Organika', value: 655, color: '#16a34a' },
  { name: 'Manychat', value: 559, color: '#eab308' },
];

const sourceCards = [
  {
    name: 'Meta',
    value: 5254,
    percent: 60,
    textColor: 'var(--danger-color)',
    bg: 'var(--danger-bg)',
  },
  {
    name: 'Organika',
    value: 655,
    percent: 8,
    textColor: 'var(--success-color)',
    bg: 'var(--success-bg)',
  },
  {
    name: "Qo'ng'iroq",
    value: 1307,
    percent: 15,
    textColor: 'var(--info-color)',
    bg: 'var(--info-bg)',
  },
  {
    name: 'Community',
    value: 928,
    percent: 11,
    textColor: 'var(--info-color)',
    bg: 'var(--info-bg)',
  },
  {
    name: 'Manychat',
    value: 559,
    percent: 6,
    textColor: 'var(--warning-color)',
    bg: 'var(--warning-bg)',
  },
];

const branchDonutSeries = [
  { name: 'Belgilanmagan', value: 18, color: '#f97316' },
  { name: "Uchrashuv bo'lgan", value: 26, color: '#1d9bd1' },
  { name: "Xarid bo'lgan", value: 56, color: '#16a34a' },
];

const branches = ['Sag’bon filiali', 'Qoratosh filiali', 'Parkent filiali'];

function RingChart({ data, centerLabel, height = 280 }) {
  const centerGraphic = (() => {
    if (!centerLabel) return [];

    if (centerLabel.title) {
      return [
        {
          type: 'text',
          left: 'center',
          top: 'middle',
          z: 10,
          silent: true,
          style: {
            text: centerLabel.title,
            align: 'center',
            verticalAlign: 'middle',
            textAlign: 'center',
            textVerticalAlign: 'middle',
            fill: 'var(--primary-color)',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 16,
          },
        },
      ];
    }

    return [
      {
        type: 'text',
        left: 'center',
        top: '43%',
        style: {
          text: centerLabel.value,
          textAlign: 'center',
          fill: 'var(--chart-text-color)',
          fontSize: 13,
          fontWeight: 700,
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '55%',
        style: {
          text: centerLabel.label,
          textAlign: 'center',
          fill: 'var(--chart-legend-color)',
          fontSize: 9,
          fontWeight: 500,
        },
      },
    ];
  })();

  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    series: [
      {
        type: 'pie',
        radius: ['56%', '94%'],
        center: ['50%', '50%'],
        startAngle: 90,
        avoidLabelOverlap: true,
        itemStyle: { borderColor: 'var(--primary-bg)', borderWidth: 1 },
        emphasis: { scale: true },
        label: { show: false },
        labelLine: { show: false },
        data: data.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color },
        })),
      },
    ],
    graphic: centerGraphic,
  };

  return <EChart option={option} height={height} />;
}

function SourceSummaryCard({ item, full }) {
  return (
    <div
      style={{
        width: '100%',
        background: item.bg,
        borderRadius: 16,
        padding: full ? '14px 18px 12px' : '12px 14px 10px',
        minHeight: full ? 76 : 70,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 4,
        }}
      >
        <span style={{ color: item.textColor, fontWeight: 700, fontSize: 16 }}>
          {item.value.toLocaleString('ru-RU')}
        </span>
        <span style={{ color: 'var(--metric-divider-color)', fontSize: 16 }}>
          |
        </span>
        <span
          style={{
            color: item.textColor,
            background: 'var(--metric-pill-overlay-bg)',
            borderRadius: 8,
            padding: '3px 7px',
            fontSize: 12,
            lineHeight: 1,
            fontWeight: 600,
          }}
        >
          {item.percent}%
        </span>
      </div>
      <div
        style={{
          textAlign: 'center',
          color: 'var(--primary-color)',
          opacity: 0.9,
          fontSize: 10,
          fontWeight: 500,
          lineHeight: 1.1,
        }}
      >
        {item.name}
      </div>
    </div>
  );
}

export default function LeadsDistributionSection() {
  const total = sourceRingData.reduce((sum, item) => sum + item.value, 0);
  return (
    <Row direction={{ xs: 'column', lg: 'row' }} gutter={4}>
      <Col fullWidth>
        <Card title="Do'konlar bo'yicha">
          <Row
            direction={{ xs: 'column', lg: 'row' }}
            gutter={4}
            align="center"
          >
            <Col fullWidth>
              <div style={{ width: '100%', maxWidth: 250, margin: '0 auto' }}>
                <RingChart
                  data={sourceRingData}
                  centerLabel={{
                    value: total.toLocaleString('ru-RU'),
                    label: 'Jami leadlar',
                  }}
                  height={250}
                />
              </div>
            </Col>
            <Col flexGrow fullWidth>
              <Row gutter={3}>
                <Col fullWidth>
                  <SourceSummaryCard item={sourceCards[0]} full />
                </Col>
                <Col fullWidth>
                  <Row gutter={3} direction={{ xs: 'column', md: 'row' }}>
                    <Col fullWidth flexGrow>
                      <SourceSummaryCard item={sourceCards[1]} full />
                    </Col>
                    <Col fullWidth flexGrow>
                      <SourceSummaryCard item={sourceCards[2]} full />
                    </Col>
                  </Row>
                </Col>
                <Col fullWidth>
                  <Row gutter={3} direction={{ xs: 'column', md: 'row' }}>
                    <Col fullWidth flexGrow>
                      <SourceSummaryCard item={sourceCards[3]} />
                    </Col>
                    <Col fullWidth flexGrow>
                      <SourceSummaryCard item={sourceCards[4]} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col fullWidth fullHeight>
        <Card title="Do'konlar bo'yicha">
          <Row
            gutter={3}
            direction={{ xs: 'column', md: 'row' }}
            justify="center"
            wrap
          >
            {branches.map((branch) => (
              <Col key={branch} flexGrow>
                <div className="mx-auto w-full max-w-[260px]">
                  <RingChart
                    data={branchDonutSeries}
                    centerLabel={{
                      title: branch,
                    }}
                    height={230}
                  />
                </div>
              </Col>
            ))}
          </Row>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 22,
              flexWrap: 'wrap',
              marginTop: 4,
            }}
          >
            {branchDonutSeries.map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--primary-color)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: item.color,
                    display: 'inline-block',
                  }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
}
