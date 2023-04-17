
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PlaylistCard from '../subComponents/PlaylistCard';


export default function Overview({ playlistData }) {

    const minMaxData = {
        happiestWrapped: null,
        saddestWrapped: null,
        longestWrapped: null,
        shortestWrapped: null,
        danciestWrapped: null,
        calmestWrapped: null,
        basicWrapped: null,
        uniqueWrapped: null,
    };

    // not accounting for ties
    const findMinMax = (key: string) => {
        let minPlaylist;
        let maxPlaylist;
        let minValue = Infinity;
        let maxValue = -Infinity;
        playlistData.forEach(playlist => {
            if (playlist[key] > maxValue) {
                maxValue = playlist[key];
                maxPlaylist = playlist;
            }
            if (playlist[key] < minValue) {
                minValue = playlist[key];
                minPlaylist = playlist;
            }
        });
        return { minPlaylist, maxPlaylist }
    }

    // totalDuration
    const { minPlaylist: shortestWrapped, maxPlaylist: longestWrapped } = findMinMax('totalDuration');
    minMaxData.shortestWrapped = shortestWrapped;
    minMaxData.longestWrapped = longestWrapped;

    // mood
    const { minPlaylist: saddestWrapped, maxPlaylist: happiestWrapped } = findMinMax('mood');
    minMaxData.saddestWrapped = saddestWrapped;
    minMaxData.happiestWrapped = happiestWrapped;

    // dance
    const { minPlaylist: calmestWrapped, maxPlaylist: danciestWrapped } = findMinMax('dance');
    minMaxData.calmestWrapped = calmestWrapped;
    minMaxData.danciestWrapped = danciestWrapped;

    // popularity
    const { minPlaylist: uniqueWrapped, maxPlaylist: basicWrapped } = findMinMax('popularity');
    minMaxData.uniqueWrapped = uniqueWrapped;
    minMaxData.basicWrapped = basicWrapped;

    return (
        <>
            <Paper elevation={12} sx={{ paddingBottom: 5, paddingLeft: 2, paddingRight: 2, bgcolor: 'primary.main' }}>
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
                            Overview Of Your Wrappeds
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Happiest Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.happiestWrapped} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Saddest Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.saddestWrapped} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Longest Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.longestWrapped} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Shortest Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.shortestWrapped} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Danciest Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.danciestWrapped} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Calmest Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.calmestWrapped} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Most Unique Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.uniqueWrapped} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Most Basic Year
                        </Typography>
                        <PlaylistCard playlist={minMaxData.basicWrapped} />
                    </Grid>
                </Grid>
            </Paper>

        </>
    )
}
