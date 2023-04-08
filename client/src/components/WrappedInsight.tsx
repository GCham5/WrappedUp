
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ReactWordcloud from 'react-wordcloud';
import { PieChart } from './Charts/PieChart';


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
            <Grid
                container
                direction="row"
                justifyContent="center"
                flexWrap='wrap'
                alignItems='flex-end'
                rowSpacing={5}
                columnSpacing={5}
            >
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom>
                        {playlist.year}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>
                        {playlist.name}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>
                        {playlist.totalDuration}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ReactWordcloud options={options} words={words} />
                </Grid>
                <Grid item xs={12}>
                    <PieChart data={playlist.genres} label={''} side={'right'} threshold={5} />
                </Grid>
                <Grid item xs={12}>
                    <PieChart data={playlist.albums} label={'# of Appearances'} side={'left'} threshold={2} />
                </Grid>

                {/* <LineChart title={'Features Of Wrapped Playlists Over Time'} playlistData={playlistData} dataset={[{ 'key': 'acousticness', 'label': 'Acousticness' }, { 'key': 'danceability', 'label': 'Danceability' }]} value={'mean'} /> */}
            </Grid>
        </>
    )
}
