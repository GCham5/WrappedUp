
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import TopFive from './TopFive';


export default function InsightsOverview({ playlistData }) {

    let moodIcon;

    const topFiveTracksWithImages = playlistData.tracks.slice(0, 5).map((track) => ({
        ...track,
        images: track.album.images
    }));

    // convert to array then sort based off count
    const topFiveArtists = Object.values(playlistData.artists).sort((a, b) => b['count'] - a['count']).slice(0, 5);

    const topFiveAlbums = Object.values(playlistData.albums).sort((a, b) => b['count'] - a['count']).slice(0, 5);

    // const topFiveData = [
    //     tracksWithImages,
    //     Object.values(playlistData.artists).sort((a, b) => b['count'] - a['count']).slice(0, 5), // convert to array then sort based off count
    //     Object.values(playlistData.albums).sort((a, b) => b['count'] - a['count']).slice(0, 5)
    // ]

    if (playlistData.mood < 0.5) {
        moodIcon = <SentimentVeryDissatisfiedIcon />;
    } else if (playlistData.mood > 0.5) {
        moodIcon = <SentimentSatisfiedAltIcon />;
    } else {
        moodIcon = <SentimentNeutralIcon />;
    }


    return (
        <>
            <Paper elevation={12} sx={{ paddingBottom: 5, paddingLeft: 2, paddingRight: 2 }} >
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
                        <Typography variant="h4" gutterBottom>
                            Overview
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1" gutterBottom>
                            Length: {playlistData.totalDuration.toFixed(1)} hours
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1" gutterBottom>
                            Popularity: {playlistData.popularity.toFixed(1)}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1" gutterBottom>
                            Mood:{" "}
                            {moodIcon}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Top Five Songs
                        </Typography>
                        <TopFive items={topFiveTracksWithImages} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Top Five Artists
                        </Typography>
                        <TopFive items={topFiveArtists} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Top Five Albums
                        </Typography>
                        <TopFive items={topFiveAlbums} />
                    </Grid>
                    {/* <Grid item xs={12}>
                        {topFiveData.map((data, index) => (
                            <TopFive key={index} items={data} />
                        ))}
                    </Grid> */}
                </Grid>
            </Paper>

        </>
    )
}
