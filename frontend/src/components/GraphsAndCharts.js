import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const accountBalanceData = {
 labels: ['Account 1', 'Account 2', 'Account 3'],
 datasets: [
   {
     label: 'Account Balance',
     data: [1000, 2000, 1500], // Replace with actual account balance data
     backgroundColor: 'rgba(75, 192, 192, 0.2)',
     borderColor: 'rgba(75, 192, 192, 1)',
     borderWidth: 1,
   },
 ],
};

const transactionData = {
 labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
 datasets: [
  {
    label: 'Transactions',
    data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 12, 15], // Replace with your static transaction data
    fill: false,
    backgroundColor: 'rgb(75, 192, 192)',
    borderColor: 'rgba(75, 192, 192, 0.2)',
  },
 ],
};

const accountBalanceOptions = {
 scales: {
   y: {
     beginAtZero: true,
   },
 },
};

const transactionOptions = {
 scales: {
   x: {
     type: 'time',
     time: {
       unit: 'month',
     },
   },
   y: {
     beginAtZero: true,
   },
 },
};

const GraphsAndCharts = ({ classes }) => {
 return (
   <Card className={classes.dashboardCard}>
     <CardContent className={classes.dashboardCardContent}>
       <Typography variant='h6' component='h2' gutterBottom>
         Graphs and Charts
       </Typography>
       <Bar data={accountBalanceData} options={accountBalanceOptions} />
       <Line data={transactionData} options={transactionOptions} />
     </CardContent>
   </Card>
 );
};

export default GraphsAndCharts;