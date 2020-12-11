import React from 'react'
import { Bar } from "react-chartjs-2";
import numeral from "numeral";
import './Chart.css'
const data = require('./data.json');


function Chart({ demandDate }) {

  return (
    <div className="chart">
      <Bar
        data={{
          labels: Object.keys(demandDate),
          datasets: [{
            data: Object.values(demandDate),
            borderWidth: 1
          }]
        }}
        width={600}
        height={400}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function (value, index, values) {
                    return numeral(value).format("0a");
                  },
                },
              },
            ],
          },
        }}
      />
    </div>
  )
}

export default Chart