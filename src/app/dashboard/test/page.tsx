'use client';
import dynamic from 'next/dynamic';
export default function Test() {
  const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
  const series = [100, 100];
  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
                label: '共',
                formatter: function () {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 2 + "台"
            }
          }
        }
      }
    },
    labels: ['在线', '离线'],
  }
  return (
      <>
        <h1>Test</h1>
        <ReactApexChart options={options} type="radialBar" series={series} height={350} />
      </>
  )
}