'use client';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts'
export default function Test() {
  const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
  const series = [1, 2];

  const onHoverTooltipFormatter = (val: number,opts: { seriesIndex: number, dataPointIndex: number, w: any }) => {
    console.log("onHoverTooltipFormatter")
    return `${val}`;
  };

  const options: ApexOptions= {
    chart: {
      height: 350,
      type: 'donut',
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      formatter: function(val, opts) {
        return val + "  " + opts.w.globals.series[opts.seriesIndex] + "台"
      }
    },
    plotOptions: {
    },
    tooltip: {
      y: {
        formatter: onHoverTooltipFormatter
      }
    },
    labels: ['在线', '离线'],
  }
  return (
      <>
        <ReactApexChart options={options} type="donut" series={series} height={350} />
      </>
  )
}