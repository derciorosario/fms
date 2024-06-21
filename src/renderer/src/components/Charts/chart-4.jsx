// DoughnutChart.js
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, DoughnutController, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register necessary Chart.js components and the datalabels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the datalabels plugin
);

const DoughnutChart = ({datasets,backgroundColor,label,labels,borderColor}) => {
  const data = {
    labels,
    datasets: [
      {
        label: label ? label : '',
        data: datasets,
        backgroundColor,
        borderColor: Array.from({ length: 7 }, () => '#fff') ,//borderColor ? borderColor : [],
        borderWidth: datasets.filter(i=>i).length > 1 ? 1 : 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
     plugins: {
      legend: {
        position: 'right' // Position the legend on the right
      },
      
      datalabels: {
        formatter: (value, context) => {
          const sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        
          const percentage = ((value / sum) * 100);
          return percentage ? percentage.toFixed(2) + '%' : '';
        },
        color: '#fff',
        labels: {
          title: {
            font: {
              weight: 'bold'
            }
          }
        }
      }
    }
  };

  return (
      <Doughnut data={data} options={options} />
  );
};

export default DoughnutChart;
