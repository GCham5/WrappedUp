import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function GenresOverTime({ playlistData }) {


    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Bar Chart - Stacked',
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const labels = playlistData.map(playlist => playlist.year).reverse();
    const dataArray = []
    console.log(playlistData[0].genres)
    for (const key in playlistData.genres) {
        const genre = playlistData.genres[key]
        console.log(genre)
        // randomize colours for each dataSet
        const red = Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const green = Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const blue = Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const dataset = {
            label: genre['name'],
            // fill: false,
            // borderColor: `rgba(${red},${green},${blue},1)`,
            backgroundColor: `rgba(${red},${green},${blue},0.5)`,
            // tension: 0.3,
            data: genre['counts']
        }
        dataArray.push(dataset)
    }

    console.log(dataArray)
    const chartData = {
        labels: labels,
        datasets: dataArray
    };
    return (
        <>
            <Bar options={options} data={chartData} />
        </>
    )
}