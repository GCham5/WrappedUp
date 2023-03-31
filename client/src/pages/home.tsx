import Head from 'next/head'
import Image from 'next/image'
import MyCard from '@/components/MyCard'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import Trends from '@/components/Trends'
import Insights from '@/components/Insights'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

    type PlaylistData = {
        playlist: {
            id: string;
            name: string;
            images: any[];
        },
        audioFeatures: any; // cleanup
        tracks: {
            track: {
                id: string;
                name: string;
                popularity: number;
                album: {
                    id: string;
                    name: string;
                    images: any[];
                },
                artists: any[]; //clean it up later
            }
        }[],
        totalDuration: number;
    }

    const [wrappedPlaylists, setWrappedPlaylists] = useState<PlaylistData[]>([])
    const [activeTab, setActiveTab] = useState('trends');
    // const [accessToken, setAccessToken] = useState('');

    const clearQueryParams = () => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const accessToken = urlParams.get('access_token');
        // setAccessToken(accessToken)
        const refreshToken = urlParams.get('refresh_token');
        // window.history.pushState({}, '', window.location.pathname);

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
        }
        fetchWrappedPlaylists();
        // clearQueryParams();
    }, [])

    if (wrappedPlaylists.length === 0) {
        return <h1>Loading....</h1>
    }

    // console.log(wrappedPlaylists)

    return (
        <>
            <Head>
                <title>Trends</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div>
                    <h1>Wrapped Up</h1>
                </div>
                <div>
                    <button onClick={() => handleTabClick('trends')}>Trends</button>
                    <button onClick={() => handleTabClick('insights')}>Insights</button>
                </div>
                <div>
                    {activeTab === 'trends' && <Trends playlistData={wrappedPlaylists} />}
                    {activeTab === 'insights' && <Insights playlistData={wrappedPlaylists}/>}
                </div>
                <MyCard />
            </main>
        </>
    )
}

