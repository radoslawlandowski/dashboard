import React from 'react';

// @ts-ignore
import GaugeChart from "react-gauge-chart";

const StyledGauge = (props: any) => {
  const gaugeData = 0.7; // Value between 0 and 1

  const {id} = props;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Your Gauge</h2>
      <GaugeChart
        style={{ width: '400px' }}
        id={id}
        percent={gaugeData}
        arcPadding={0.02}
        cornerRadius={3}
        textColor="#333"
        needleColor="#F00"
        colors={['green', 'red']}
      />
    </div>
  );
};

export default StyledGauge;
