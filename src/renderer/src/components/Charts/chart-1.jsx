// MixedChart.js
import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, LineController, BarController, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Chart } from 'react-chartjs-2';




// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MixedChart = ({labels, datasets, horizontal,gridY,titleY,ticksY,title,lengend}) => {

  
const chartRef = useRef(null);

useEffect(() => {
  const handleResize = () => {
    if (chartRef?.current) {

    chartRef.current.chartInstance.resize();
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, [])


  const data = {
    labels:labels ? labels:[],
    datasets:datasets ? datasets:[]
  };

  const options = {
    indexAxis:horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: 'white', 
        formatter: (value) => {
          return value ? value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
        },
      },
      
      title: {
        display: title || false, 
      },
      legend: {
        display: lengend || false, 
      
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
            display: gridY==false ? false : true  // Disable grid lines on the x-axis
        },
        ticks: {
          display: ticksY || false, 
        },
        title: {
          display:titleY || false, 
        },
      },
      x: {
        stacked: false,
        grid: {
            display: false // Disable grid lines on the x-axis
        }
      }
    }
  };

  return (
      <Chart ref={chartRef} type='bar' data={data} options={options} />
  );
};

export default MixedChart;
