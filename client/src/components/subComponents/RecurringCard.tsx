import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea } from '@mui/material';

export default function PlaylistCard({ item }) {

    const goToItem = () => {
        // window.open(playlist.url, '_blank');
    };

    return (
        <Card sx={{ width: 300, height: 420 }}>
            <CardActionArea onClick={goToItem}>
                <CardMedia
                    component="img"
                    height="300"
                    width="300"
                    image={item.images[1].url}
                    alt="playlist image"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 1, overflowWrap: 'break-word' }}>
                        {item.name}
                    </Typography>
                    <Typography gutterBottom variant="body1" component="div" sx={{ overflowWrap: 'break-word' }}>
                        Years appeared in: {item.years.join(', ')}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}