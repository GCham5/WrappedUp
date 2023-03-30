import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Trends({ playlistData }) {
    return (
        <>
            {/* <main className={styles.main}> */}
                <h1>Trends</h1>
                <ul>
                    {playlistData.map(data => (
                        <li key={data.playlist.id}>
                            {/* {data.playlist.name} */}
                            {data.tracks[0].track.name}
                        </li>
                    ))}
                </ul>
            {/* </main> */}
        </>
    )
}
