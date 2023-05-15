import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TrackCard from '../subComponents/TrackCard';


export default function TopFive({ items, title }) {

    return (
        <>
            <Paper elevation={15} sx={{ paddingTop: 3, paddingBottom: 5, paddingLeft: 2, paddingRight: 2, bgcolor: 'background.default' }} >
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    flexWrap='wrap'
                    alignItems='flex-end'
                    rowSpacing={3}
                    columnSpacing={3}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            {title}
                        </Typography>
                    </Grid>
                    {items.map(item => (
                        <Grid item key={item.id + 'TF'} xs="auto">
                            <TrackCard item={item} />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </>
    )
}
