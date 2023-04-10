import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { LineChart } from './Charts/LineChart'
import PlaylistCard from '@/components/subComponents/PlaylistCard'
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';


const inter = Inter({ subsets: ['latin'] })

export default function AllPlaylists({ playlists }) {

    return (
        <>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>
                    <h1>All Your Wrapped Playlists</h1>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={5}
                >
                    {playlists.map(playlist => (
                        <Grid item key={playlist.id}>
                            <Chip label={playlist.name} color="success" />
                            {/* <PlaylistCard playlist={playlist} /> */}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </>
    )
}
