// MixedChart.js
import React from 'react';
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

const MixedChart = ({labels, datasets, horizontal}) => {
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
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
            display: true // Disable grid lines on the x-axis
        }
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
      <Chart type='bar' data={data} options={options} />
  );
};

export default MixedChart;
