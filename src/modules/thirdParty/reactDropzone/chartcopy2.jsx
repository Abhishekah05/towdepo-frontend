import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const DriverChart2 = () => {
  const [driverRecords, setDriverRecords] = useState([]);

  useEffect(() => {
    // Fetch records from the server
    axios.get('http://localhost:4500/records')
      .then(response => {
        setDriverRecords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the records!', error);
      });
  }, []);
  
  // Aggregate the reasons by driver
  const driverReasons = {};
  driverRecords.forEach(record => {
    if (!driverReasons[record.driver]) {
      driverReasons[record.driver] = {};
    }
    if (!driverReasons[record.driver][record.reason]) {
      driverReasons[record.driver][record.reason] = 0;
    }
    driverReasons[record.driver][record.reason]++;
  });

  // Prepare data for Chart.js
  const labels = Object.keys(driverReasons);
  const reasons = [...new Set(driverRecords.map(record => record.reason))];
  const datasets = reasons.map(reason => ({
    label: reason,
    data: labels.map(driver => driverReasons[driver][reason] || 0),
    backgroundColor: getRandomColor()
  }));


  // Function to generate random colors for datasets
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Chart.js configuration
  const chartData = {
    labels: labels,
    datasets: datasets
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max:10
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Driver Data Mapped with Reasons'
      }
    }
  };

  // Function to download chart as image
  const downloadImage = () => {
    const canvas = document.getElementById('driverChart');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'driver-data-chart.png';
    link.click();
  };

  return (
    <div>
      <Bar id="driverChart" data={chartData} options={options} />
      <button onClick={downloadImage}>Download Chart as Image</button>
    </div>
  );
};

export default DriverChart2;
