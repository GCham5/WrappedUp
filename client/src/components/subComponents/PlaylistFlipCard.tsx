import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import Image from 'next/image'
import { Typography } from '@mui/material';

export default function PlaylistFlipCard({ playlist, title }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = (event) => {
        event.preventDefault();
        setIsFlipped(!isFlipped);
    };

    return (
        <ReactCardFlip isFlipped={isFlipped}>
            <div onClick={handleClick} style={{
                cursor: 'pointer',
                width: 200,
                height: 225,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                // borderRadius: 8,
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            }}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
            </div>
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                <figure>
                    <Image
                        src={playlist.image}
                        alt="description of image"
                        width={200}
                        height={200}
                    />
                </figure>
                <figcaption>{title}</figcaption>
            </div>
        </ReactCardFlip>
    );
};
