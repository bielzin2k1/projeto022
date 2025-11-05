'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ActionTypeChartProps {
  data: {
    small: number;
    medium: number;
    large: number;
  };
}

export default function ActionTypeChart({ data }: ActionTypeChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    labels: ['Pequeno Porte', 'Médio Porte', 'Grande Porte'],
    colors: ['#3B82F6', '#EAB308', '#EF4444'],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Exo 2, sans-serif',
        fontWeight: 'bold',
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.8,
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#E6EDF3',
      },
      markers: {
        size: 12,

      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Orbitron, sans-serif',
              color: '#E6EDF3',
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'Orbitron, sans-serif',
              color: '#00F0FF',
              fontWeight: 'bold',
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: '#9CA3AF',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    stroke: {
      width: 2,
      colors: ['#0D1117'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Exo 2, sans-serif',
      },
      y: {
        formatter: function (val) {
          return val + ' ações';
        },
      },
    },
  };

  const series = [data.small, data.medium, data.large];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <Chart options={options} series={series} type="donut" height="100%" />
    </div>
  );
}

