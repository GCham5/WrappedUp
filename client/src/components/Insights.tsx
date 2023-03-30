import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Insights({ playlistData }) {
    return (
        <>
            {/* <main className={styles.main}> */}
            <h1>Insights</h1>
            <ul>
                {playlistData.map(data => (
                    <li key={data.playlist.id}>
                        {/* {data.playlist.name} */}
                        {data.tracks[0].track.artists[0].name}
                    </li>
                ))}
            </ul>
            {/* </main> */}
        </>
    )
}
