import Grid from '@mui/material/Grid';
import TrackCard from '@/components/subComponents/TrackCard';
import { Typography } from '@mui/material';

export default function MostLeastPopularTracks({ playlist }) {

    const findMostAndLeastPopularTracks = () => {
        let leastPopularTracks = [];
        let mostPopularTracks = [];
        let minValue = Infinity;
        let maxValue = -Infinity;

        // get min and max first
        playlist.tracks.forEach(track => {
            if (track.popularity > maxValue) {
                maxValue = track.popularity;
            }
            if (track.popularity < minValue) {
                minValue = track.popularity;
            }
        });

        playlist.tracks.forEach(track => {
            if (track.popularity === maxValue) {
                track.images = track.album['images']
                mostPopularTracks.push(track);
            }
            if (track.popularity === minValue) {
                track.images = track.album['images']
                leastPopularTracks.push(track)
            }
        });
        return { leastPopularTracks, mostPopularTracks }
    }

    const { leastPopularTracks, mostPopularTracks } = findMostAndLeastPopularTracks();
    console.log(leastPopularTracks)
    console.log(mostPopularTracks)


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
                    <Typography>
                        Your least popular songs of this year
                    </Typography>
                </Grid>
                {leastPopularTracks.map(track => (
                    < Grid item key={track.id} >
                        <TrackCard item={track} />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}