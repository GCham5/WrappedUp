import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import Trends from '@/components/Trends'
import Insights from '@/components/Insights'
import AllPlaylists from '@/components/AllPlaylists'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material'




const inter = Inter({ subsets: ['latin'] })

export default function Home() {

    type User = {
        display_name: string;
        id: string;
        images: any[];
        topArtists: {
            id: string;
            name: string;
            populartiy: number;
            genres: string[]
        }[]
    }


    type PlaylistData = {
        id: string;
        name: string;
        image: string;
        totalDuration: number;
        url: string;
        year: string;
        audioFeatures: any; // cleanup
        artists: {
            id: {
                name: string,
                count: number
            }
        },
        tracks: {
            id: string;
            name: string;
            popularity: number;
            album: {
                id: string;
                name: string;
                images: any[];
            },
            artists: any[]; //clean it up later
        }[],
    }

    const [wrappedPlaylists, setWrappedPlaylists] = useState<PlaylistData[]>([])
    const [user, setUser] = useState<User>();
    const [activeTab, setActiveTab] = useState('trends');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('')

    const clearQueryParams = () => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
    }

    useEffect(() => {

        // TODO: make this its own function
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)


        async function fetchWrappedPlaylists() {
            const res = await fetch('http://127.0.0.1:5000/wrapped_playlists', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            const data = await res.json()
            setWrappedPlaylists(data)
            console.log(data)
        }

        async function getUser() {
            const res = await fetch('http://127.0.0.1:5000/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })
            const data = await res.json()
            setUser(data)
            console.log(data)
        }

        // getTokens();
        // window.history.pushState({}, '', window.location.pathname);
        fetchWrappedPlaylists();
        getUser();
        // clearQueryParams();
    }, [])





    if (wrappedPlaylists.length === 0) {
        return (
            <div>
                <CircularProgress color="primary" size={80} />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Trends</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ mx: 10, my: 5 }}>
                <Grid
                    container
                    // direction="column"
                    justifyContent="space-evenly"
                    alignItems="center"
                    alignContent="center"
                    rowSpacing={8}
                >
                    <Grid
                        container
                        item xs={12}
                        direction="column"
                        alignItems="center"
                        alignContent="center"
                    >

                        <Typography variant="h2" gutterBottom>
                            WrappedUp
                        </Typography>

                        <Typography variant="h5" gutterBottom>
                            Hello,  {user.display_name}
                        </Typography>

                    </Grid>
                    <Grid
                        container
                        justifyContent="center"
                        item xs={12}
                    >
                        <Button onClick={() => handleTabClick('trends')}>Trends</Button>
                        <Button onClick={() => handleTabClick('insights')}>Insights</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <AllPlaylists playlists={wrappedPlaylists.map(data => ({ id: data.id, name: data.name, year: data.year, image: data.image, url: data.url }))} />
                    </Grid>
                    <Grid item xs={12}>
                        {activeTab === 'trends' && <Trends playlistData={wrappedPlaylists} userData={user} />}
                        {activeTab === 'insights' && <Insights playlistData={wrappedPlaylists} />}
                    </Grid>
                </Grid>

            </Box>


        </>
    )
}


