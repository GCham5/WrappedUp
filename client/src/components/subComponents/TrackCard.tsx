import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Grid } from '@mui/material';

export default function TrackCard({ item }) {

    const goToItem = () => {
        // window.open(playlist.url, '_blank');
    };

    return (
        <Card >
            <Grid container
                alignItems='center'
                justifyContent='center'
            >
                {/* <CardActionArea onClick={goToItem}> */}
                <Grid item>
                    <CardMedia
                        component="img"
                        height="150"
                        width="150"
                        image={item.images[1].url}
                        alt="playlist image"
                    />
                </Grid>
                <Grid item>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" >
                            {item.name}
                        </Typography>
                        {item.years && (
                            <Typography gutterBottom variant="body1" component="div" sx={{ overflowWrap: 'break-word' }}>
                                Years appeared in: {item.years.join(', ')}
                            </Typography>
                        )}
                    </CardContent>
                </Grid>
                {/* </CardActionArea> */}
            </Grid>
        </Card>
    );
}