import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Grid, Paper, Chip } from '@mui/material';

export default function TrackCard({ item }) {

    const goToItem = () => {
        // window.open(playlist.url, '_blank');
    };

    return (
        <Paper elevation={3}>
            <Card sx={{ width: '160px', maxHeight: '400px' }}>
                <Grid
                    container
                    flexDirection='column'
                    alignItems='stretch'
                    justifyContent='center'
                    wrap="nowrap"
                >
                    {/* <CardActionArea onClick={goToItem}> */}
                    <Grid item sx={{ paddingTop: 1, paddingLeft: 1, paddingRight: 1 }}>
                        <Paper elevation={12}>
                            <CardMedia
                                component="img"
                                height="150"
                                width="150"
                                image={item.images[1].url}
                                alt="playlist image"
                            />
                        </Paper>

                    </Grid>
                    <Grid item xs>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" component="div" sx={{
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }} >
                                {item.name}
                            </Typography>
                            {item.years && (
                                <div>
                                    {item.years.map(year => (
                                        // <Grid item key={item.id}>
                                        <Chip label={year} color="success" key={item.id} sx={{ margin: "2px" }} />
                                        // </Grid>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Grid>
                    {/* </CardActionArea> */}
                </Grid>
            </Card >
        </Paper>
    );
}