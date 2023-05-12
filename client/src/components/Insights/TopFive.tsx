import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TrackCard from '../subComponents/TrackCard';


export default function TopFive({ items }) {

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="center"
                flexWrap='wrap'
                alignItems='flex-end'
                rowSpacing={3}
                columnSpacing={3}
            >
                {items.map(item => (
                    <Grid item key={item.id + 'TF'} xs="auto">
                        <TrackCard item={item} />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
