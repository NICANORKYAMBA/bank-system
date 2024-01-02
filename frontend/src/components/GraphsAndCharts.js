import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const GraphsAndCharts = ({ classes }) => {
  return (
    <Card className={classes.dashboardCard}>
      <CardContent className={classes.dashboardCardContent}>
        <Typography variant='h6' component='h2' gutterBottom>
          Graphs and Charts
        </Typography>
        <Typography color='textSecondary'>
          Graphs and charts will be displayed here.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GraphsAndCharts;
