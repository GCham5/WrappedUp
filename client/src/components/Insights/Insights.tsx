import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import WrappedInsight from './WrappedInsight';


export default function Insights({ playlistData, userData }) {
    return (

        <Grid
            container
            item
            direction="row"
            justifyContent="center"
            flexWrap='wrap'
            alignItems='flex-end'
            rowSpacing={5}
            columnSpacing={5}
        >
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>
                    Insights
                </Typography>
            </Grid>
            {/* <Grid item xs={12}> */}
            {playlistData.map(playlist => (
                <Grid item key={playlist.id + 'I'} xs={12}>
                    <WrappedInsight playlist={playlist} />
                    <Divider />
                </Grid>
            ))}
            {/* </Grid> */}
            {/* <LineChart title={'Features Of Wrapped Playlists Over Time'} playlistData={playlistData} dataset={[{ 'key': 'acousticness', 'label': 'Acousticness' }, { 'key': 'danceability', 'label': 'Danceability' }]} value={'mean'} /> */}
        </Grid>

    )
}
