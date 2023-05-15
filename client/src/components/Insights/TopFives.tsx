
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import TopFive from './TopFive';


export default function TopFives({ playlistData }) {

    const topFiveTracksWithImages = playlistData.tracks.slice(0, 5).map((track) => ({
        ...track,
        images: track.album.images
    }));

    // convert to array then sort based off count
    const topFiveArtists = Object.values(playlistData.artists).sort((a, b) => b['count'] - a['count']).slice(0, 5);

    const topFiveAlbums = Object.values(playlistData.albums).sort((a, b) => b['count'] - a['count']).slice(0, 5);


    return (
        <>
            <Typography variant="h4" gutterBottom>
                Top Fives
            </Typography>
            {/* <Paper elevation={12} sx={{ paddingBottom: 5, paddingLeft: 2, paddingRight: 2 }} > */}
            <Grid
                container
                direction="row"
                justifyContent="center"
                flexWrap='wrap'
                alignItems='flex-end'
                rowSpacing={5}
                columnSpacing={5}
            >
                {/* <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Top Fives
                    </Typography>
                </Grid> */}
                <Grid item xs={12}>
                    <TopFive items={topFiveTracksWithImages} title={'Songs'} />
                </Grid>
                <Grid item xs={12}>
                    <TopFive items={topFiveArtists} title={'Artists'} />
                </Grid>
                <Grid item xs={12}>
                    <TopFive items={topFiveAlbums} title={'Albums'} />
                </Grid>
            </Grid>
            {/* </Paper> */}

        </>
    )
}
