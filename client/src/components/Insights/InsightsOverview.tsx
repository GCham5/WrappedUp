
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';


export default function InsightsOverview({ playlistData }) {

    let moodIcon;

    if (playlistData.mood < 0.5) {
        moodIcon = <SentimentVeryDissatisfiedIcon />;
    } else if (playlistData.mood > 0.5) {
        moodIcon = <SentimentSatisfiedAltIcon />;
    } else {
        moodIcon = <SentimentNeutralIcon />;
    }


    return (
        <>
            <Typography variant="h4" gutterBottom sx={{ paddingBottom: 4 }}>
                Overview
            </Typography>
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
                    {/* <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            Overview
                        </Typography>
                    </Grid> */}
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
                </Grid>
            </Paper>

        </>
    )
}
