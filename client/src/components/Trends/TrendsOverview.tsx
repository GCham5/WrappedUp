import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PlaylistCard from '../subComponents/PlaylistCard';
import PlaylistFlipCard from '../subComponents/PlaylistFlipCard';
// import { useTheme } from '@mui/material/styles';


export default function TrendsOverview({ playlistData }) {
    // const theme = useTheme();

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

    const playlists = [
        { title: 'Happiest Year', playlist: minMaxData.happiestWrapped },
        { title: 'Saddest Year', playlist: minMaxData.saddestWrapped },
        { title: 'Longest Year', playlist: minMaxData.longestWrapped },
        { title: 'Shortest Year', playlist: minMaxData.shortestWrapped },
        { title: 'Danciest Year', playlist: minMaxData.danciestWrapped },
        { title: 'Calmest Year', playlist: minMaxData.calmestWrapped },
        { title: 'Most Unique Year', playlist: minMaxData.uniqueWrapped },
        { title: 'Most Basic Year', playlist: minMaxData.basicWrapped },
    ]

    return (
        <>
            <Paper elevation={12} sx={{ paddingBottom: 5, paddingLeft: 2, paddingRight: 2, bgcolor: 'background.default' }}>
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
                    {playlists.map(({ title, playlist }) => (
                        <Grid item key={title}>
                            <PlaylistFlipCard playlist={playlist} title={title} />
                        </Grid>
                    ))}
                </Grid>
            </Paper>

        </>
    )
}
