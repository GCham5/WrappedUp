import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function PlaylistCard({ playlist }) {

  const goToPlaylist = () => {
    window.open(playlist.url, '_blank');
  };

  return (
    <Card>
      <CardActionArea onClick={goToPlaylist}>
        <CardMedia
          component="img"
          height="200"
          image={playlist.image}
          alt="playlist image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {playlist.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}