import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart(props) {

    const labels = []
    const counts = []
    const backgroundColors = []
    const borderColors = []
    let other = 0;
    for (const key in props.data) {

        const item = props.data[key];
        // if count is < 2, add this item to the 'Other' category in the Pie Chart
        if (item['count'] < props.threshold) {
            other++;
        } else {
            labels.push(item['name'])
            counts.push(item['count'])

            const red = Math.floor(Math.random() * (255 - 0 + 1) + 0);
            const green = Math.floor(Math.random() * (255 - 0 + 1) + 0);
            const blue = Math.floor(Math.random() * (255 - 0 + 1) + 0);

            const borderColor = `rgba(${red},${green},${blue},1)`;
            const backgroundColor = `rgba(${red},${green},${blue},0.5)`;
            borderColors.push(borderColor);
            backgroundColors.push(backgroundColor);
        }
    }

    // adding the 'Other' category
    labels.push('Other')
    counts.push(other)

    const red = Math.floor(Math.random() * (255 - 0 + 1) + 0);
    const green = Math.floor(Math.random() * (255 - 0 + 1) + 0);
    const blue = Math.floor(Math.random() * (255 - 0 + 1) + 0);

    const borderColor = `rgba(${red},${green},${blue},1)`;
    const backgroundColor = `rgba(${red},${green},${blue},0.5)`;
    borderColors.push(borderColor);
    backgroundColors.push(backgroundColor);

    const data = {
        labels: labels,
        datasets: [
            {
                label: props.label,
                data: counts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        color: 'black',
        plugins: {
            legend: {
                display: true,
                position: props.side,
            },
            title: {
                // display: true,
                // text: props.title,
            },
        },
    };
    return <Pie data={data} options={options} />;
}