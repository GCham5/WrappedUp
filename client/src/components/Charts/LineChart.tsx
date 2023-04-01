import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function LineChart(props) {

    const labels = [...props.playlistData.map(playlist => playlist.year)].reverse();
    const dataArray = []
    for (const feature of props.dataset) {
        const dataset: any = {
            label: feature['label'],
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
        }
        if (props.value !== '') {
            dataset.data = [...props.playlistData.map(playlist => playlist.audioFeatures[feature['key']][props.value])].reverse()
        } else {
            dataset.data = [...props.playlistData.map(playlist => playlist[feature['key']])].reverse()
        }
        dataArray.push(dataset)
    }

    // const dataArray = [...props.playlistData.map(playlist => playlist[props.dataset[0]['key']])].reverse();

    const chartData = {
        labels: labels,
        datasets: dataArray
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: props.title,
            },
        },
    };


    return <Line options={options} data={chartData} />;
}