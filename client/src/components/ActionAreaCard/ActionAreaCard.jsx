import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionAreaCard({item}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={item?.image}
          alt={item?.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          {item?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {item?.summary.substring(0, 140)}...
         
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
