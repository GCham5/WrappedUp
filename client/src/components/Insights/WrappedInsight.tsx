import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ReactWordcloud from 'react-wordcloud';
import { PieChart } from '../Charts/PieChart';
import InsightsOverview from './InsightsOverview';
import MostLeastPopularTracks from './MostLeastPopularTracks';
import TopFives from './TopFives';


export default function WrappedInsight({ playlist }) {

    const options = {
        fontSizes: [20, 80],
        rotations: 0,
        enableOptimizations: true,
        deterministic: true
    };
    const size = [800, 500];
    const words = []
    // get all the artists in all of the Wrappeds
    for (const artistKey in playlist.artists) {
        const artist = playlist.artists[artistKey];
        const data = {
            text: artist['name'],
            value: artist['count'],
        }
        words.push(data)
    }

    return (
        <>
            <Paper
                elevation={6}
                sx={{ paddingTop: 6, paddingBottom: 6, paddingLeft: 6, paddingRight: 6, bgcolor: playlist.color }}
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    flexWrap='wrap'
                    alignItems='flex-end'
                    rowSpacing={5}
                    columnSpacing={2}
                >
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>
                            {playlist.year}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ paddingBottom: 5 }}>
                        <InsightsOverview playlistData={playlist} />
                    </Grid>
                    <Grid item xs={12}>
                        <TopFives playlistData={playlist} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h4' gutterBottom>Artists</Typography>

                        <Paper elevation={12}>
                            <ReactWordcloud options={options} words={words} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h4' gutterBottom>Genres</Typography>
                        <Paper elevation={12}>
                            <PieChart data={playlist.genres} label={''} side={'right'} threshold={5} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h4' gutterBottom>Albums</Typography>
                        <Paper elevation={12}>
                            <PieChart data={playlist.albums} label={'# of Appearances'} side={'left'} threshold={2} />
                        </Paper>
                    </Grid>


                    {/* <LineChart title={'Features Of Wrapped Playlists Over Time'} playlistData={playlistData} dataset={[{ 'key': 'acousticness', 'label': 'Acousticness' }, { 'key': 'danceability', 'label': 'Danceability' }]} value={'mean'} /> */}
                </Grid>
            </Paper>

        </>
    )
}
