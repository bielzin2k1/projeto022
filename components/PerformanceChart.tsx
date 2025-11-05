'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PerformanceChartProps {
  victories: number;
  defeats: number;
}

export default function PerformanceChart({ victories, defeats }: PerformanceChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#E6EDF3'],
        fontWeight: 'bold',
        fontFamily: 'Orbitron, sans-serif',
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Vitórias', 'Derrotas'],
      labels: {
        style: {
          colors: ['#00FF94', '#FF0055'],
          fontSize: '14px',
          fontFamily: 'Exo 2, sans-serif',
          fontWeight: 'bold',
        },
      },
      axisBorder: {
        color: '#30363D',
      },
      axisTicks: {
        color: '#30363D',
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '12px',
          fontFamily: 'Exo 2, sans-serif',
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ['#00FF94', '#FF0055'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: function (val) {
          return val + ' ações';
        },
      },
    },
    grid: {
      borderColor: '#30363D',
      strokeDashArray: 4,
    },
    colors: ['#00FF94', '#FF0055'],
  };

  const series = [
    {
      name: 'Resultados',
      data: [victories, defeats],
    },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="loading-spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <Chart options={options} series={series} type="bar" height="100%" />
    </div>
  );
}

