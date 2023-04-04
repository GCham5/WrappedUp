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
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export function LineChart(props) {

    const style = {
        backgroundColor: 'rgb(60, 120, 147)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        boxShadow: '10px 10px 5px rgba(0, 0, 0, 0.2)',
    }

    const labels = props.data.map(playlist => playlist.year).reverse();
    const dataArray = []
    for (const feature of props.dataset) {
        const dataset: any = {
            label: feature['label'],
            fill: false,
            borderColor: 'rgba(255,255,255,1)',
            tension: 0.3,
        }
        if (props.value !== '') {
            dataset.data = [...props.data.map(playlist => playlist.audioFeatures[feature['key']][props.value])].reverse()
        } else {
            dataset.data = [...props.data.map(playlist => playlist[feature['key']])].reverse()
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
        color: 'white',
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                // display: true,
                text: props.title,
            },
        },
    };


    return <Line options={options} data={chartData} style={style} />


}