import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    BarChart,
    LineChart,
    PieChart,
    CanvasRenderer,
]);

function resolveCssVarToken(value, rootStyles) {
    if (typeof value !== 'string' || !value.includes('var(')) return value;
    return value.replace(
        /var\((--[^,\s)]+)(?:,\s*([^)]+))?\)/g,
        (_match, varName, fallback) => {
            const resolved = rootStyles.getPropertyValue(varName).trim();
            if (resolved) return resolved;
            return (fallback || '').trim();
        }
    );
}

function resolveOptionCssVars(input, rootStyles) {
    if (Array.isArray(input)) {
        return input.map((item) => resolveOptionCssVars(item, rootStyles));
    }
    if (input && typeof input === 'object') {
        const output = {};
        Object.keys(input).forEach((key) => {
            output[key] = resolveOptionCssVars(input[key], rootStyles);
        });
        return output;
    }
    return resolveCssVarToken(input, rootStyles);
}

export default function EChart({ option, height = 350, style, ...rest }) {
    const chartRef = useRef(null);
    const [themeVersion, setThemeVersion] = useState(0);
    const chartTextColor = useMemo(() => {
        if (typeof window === 'undefined') return '#3c3f47';
        return (
            getComputedStyle(document.documentElement)
                .getPropertyValue('--chart-text-color')
                .trim() || '#3c3f47'
        );
    }, [themeVersion]);
    const resolvedOption = useMemo(() => {
        if (typeof window === 'undefined') {
            return option;
        }
        const rootStyles = getComputedStyle(document.documentElement);
        return resolveOptionCssVars(option, rootStyles);
    }, [option, themeVersion]);

    useEffect(() => {
        const resizeChart = () => {
            const instance = chartRef.current?.getEchartsInstance?.();
            instance?.resize();
        };

        // Ensure proper width after first paint/layout.
        const raf1 = requestAnimationFrame(resizeChart);
        const raf2 = requestAnimationFrame(resizeChart);

        const rootEl = chartRef.current?.ele;
        const target = rootEl?.parentElement || rootEl;
        const observer =
            typeof ResizeObserver !== 'undefined' && target
                ? new ResizeObserver(() => resizeChart())
                : null;

        observer?.observe(target);
        window.addEventListener('resize', resizeChart);

        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
            observer?.disconnect();
            window.removeEventListener('resize', resizeChart);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onThemeChanged = () => {
            setThemeVersion((v) => v + 1);
            const instance = chartRef.current?.getEchartsInstance?.();
            instance?.resize();
        };

        const root = document.documentElement;
        const themeObserver = new MutationObserver((mutations) => {
            if (
                mutations.some(
                    (mutation) =>
                        mutation.type === 'attributes' &&
                        (mutation.attributeName === 'data-theme' ||
                            mutation.attributeName === 'class')
                )
            ) {
                onThemeChanged();
            }
        });

        themeObserver.observe(root, {
            attributes: true,
            attributeFilter: ['data-theme', 'class'],
        });

        return () => {
            themeObserver.disconnect();
        };
    }, []);

    return (
        <ReactEChartsCore
            ref={chartRef}
            echarts={echarts}
            option={{
                textStyle: {
                    color: chartTextColor,
                    ...(resolvedOption?.textStyle || {}),
                },
                ...resolvedOption,
                backgroundColor: 'transparent',
            }}
            style={{ height, width: '100%', ...style }}
            autoResize
            notMerge
            lazyUpdate
            {...rest}
        />
    );
}
