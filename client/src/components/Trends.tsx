import { LineChart } from './Charts/LineChart'
import TopArtistsOverTime from '../components/TopArtistsOverTime'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Trends({ playlistData, userData }) {

    // useEffect(() => {
    //     const token = localStorage.getItem('myToken');

    // }, [])

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
                        Trends
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>
                        Are Your Playlists Getting Longer or Is It Just Us?
                    </Typography>
                    <LineChart title={'Duration Of Wrapped Playlists Over Time'} data={playlistData} dataset={[{ 'key': 'totalDuration', 'label': 'Total Duration' }]} value={''} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>
                        The emotional soundtrack of your life: A graph of your moods over time.
                    </Typography>
                    <LineChart title={''} data={playlistData} dataset={[{ 'key': 'mood', 'label': 'Mood' }]} value={''} />
                </Grid>
                <Grid item xs={12}>
                    <TopArtistsOverTime playlistData={playlistData} userData={userData} />
                </Grid>

                {/* <LineChart title={'Features Of Wrapped Playlists Over Time'} playlistData={playlistData} dataset={[{ 'key': 'acousticness', 'label': 'Acousticness' }, { 'key': 'danceability', 'label': 'Danceability' }]} value={'mean'} /> */}
            </Grid>

        </>
    )
}
