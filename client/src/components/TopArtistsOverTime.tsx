import Typography from '@mui/material/Typography';
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

export default function TopArtistsOverTime({ playlistData, userData }) {

    // stuff for the line chart
    const style = {
        backgroundColor: 'rgb(34, 118, 147)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        boxShadow: '10px 10px 5px rgba(0, 0, 0, 0.2)',
    }
    const labels = playlistData.map(playlist => playlist.year).reverse();


    // get the top five all times artists of the user
    const topFiveArtists = userData.topArtists.slice(0, 5)

    // get all the artists in all of the Wrappeds
    const allArtistsInPlaylists = playlistData.map(playlist => playlist.artists)
    // console.log(allArtistsInPlaylists)
    // console.log(topFiveArtists)

    // Loop through each top artist and check if they appeared in any of the Wrapped Playlists.
    // If they did, add the count (included in the allArtistsInPlaylists). If they did not, add 0
    const totalArtistCount = []
    for (const topArtist of topFiveArtists) {
        const id = topArtist['id']
        const name = topArtist['name']
        // store the artist name and the amount of times they appeared in each playlist
        const artistCount = { 'name': name, 'counts': [] }
        for (const playlist of allArtistsInPlaylists) {
            let found = false
            for (const artist in playlist) {
                if (artist === id) {
                    console.log(artist)
                    artistCount['counts'].push(playlist[artist]['count'])
                    found = true
                }
            }
            // if the artist wasn't in the Wrapped that year, they showed up 0 times
            if (!found) {
                artistCount['counts'].push(0)
            }
        }
        artistCount['counts'].reverse()
        totalArtistCount.push(artistCount)
    }

    const dataArray = []
    for (const artist of totalArtistCount) {
        // randomize colours for each dataSet
        const red = Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const green = Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const blue = Math.floor(Math.random() * (255 - 0 + 1) + 0);
        const dataset = {
            label: artist['name'],
            fill: false,
            borderColor: `rgba(${red},${green},${blue},1)`,
            backgroundColor: `rgba(${red},${green},${blue},0.5)`,
            tension: 0.3,
            data: artist['counts']
        }
        dataArray.push(dataset)
    }

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
                labels: {
                    font: {
                        size: 18
                    }
                }
            },
        },
        scales: {
            y: {
                // grid: {
                //     // drawBorder: true,
                //     color: 'white',
                // },
                ticks: {
                    color: "white",
                    font: {
                        size: 15,
                    },
                    stepSize: 3,
                    beginAtZero: true
                }
            },
            x: {
                ticks: {
                    color: "white",
                    font: {
                        size: 14
                    },
                    stepSize: 3,
                    beginAtZero: true
                }
            }
        }
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Staying Loyal? Here's how many times your top five artists of all time appeared in your Wrappeds
            </Typography>
            <Line options={options} data={chartData} style={style} />

        </>
    )
}
