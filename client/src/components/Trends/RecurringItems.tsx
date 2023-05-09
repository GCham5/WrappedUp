import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TrackCard from '@/components/subComponents/TrackCard';
import { Paper } from '@mui/material';


export default function RecurringItems({ numberOfYears }) {

    type Tracks = {
        name: string;
        images: {
            height: number,
            width: number,
            url: string,
        }[];
        years: string[];
    }

    type Artists = {
        name: string;
        images: {
            height: number,
            width: number,
            url: string,
        }[];
        years: string[];
    }

    type Albums = {
        name: string;
        images: {
            height: number,
            width: number,
            url: string,
        }[];
        years: string[];
    }

    const [recurringTracks, setRecurringTracks] = useState<Tracks[]>([])
    const [recurringArtists, setRecurringArtists] = useState<Artists[]>([])
    const [recurringAlbums, setRecurringAlbums] = useState<Albums[]>([])

    const [occurance, setOccurance] = useState(2)
    const [selectedOption, setSelectedOption] = useState('tracks');

    const handleOccuranceChange = (event) => {
        setOccurance(event.target.value);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const [data, setData] = useState({
        tracks: [] as Tracks[],
        artists: [] as Artists[],
        albums: [] as Albums[],
    });

    useEffect(() => {

        async function fetchRecurringTracks() {
            const res = await fetch('http://localhost:5001/recurring_tracks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            const data = await res.json()
            setRecurringTracks(data)
        }

        async function fetchRecurringArtistsAndAlbums() {
            const res = await fetch('http://localhost:5001/recurring_artists_and_albums', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            const data = await res.json()
            setRecurringArtists(data[0])
            setRecurringAlbums(data[1])
        }

        fetchRecurringTracks();
        fetchRecurringArtistsAndAlbums();
    }, [])


    useEffect(() => {
        setData({
            tracks: recurringTracks,
            artists: recurringArtists,
            albums: recurringAlbums,
        });
    }, [recurringTracks, recurringArtists, recurringAlbums]);



    // generate menu items based on number of playlists
    const menuItems = [];

    for (let i = 2; i <= numberOfYears; i++) {
        menuItems.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }

    return (
        <>
            <Paper elevation={12} sx={{ marginTop: 10, paddingBottom: 5, paddingLeft: 2, paddingRight: 2, bgcolor: 'background.default' }} >
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    flexWrap='wrap'
                    alignItems='flex-end'
                    rowSpacing={5}
                    columnSpacing={5}
                >
                    <Grid item xs={12}>
                        {/* <Box sx={{ minWidth: 120 }}> */}
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="occurances">Occurances</InputLabel>
                            <Select
                                labelId="occurances"
                                id="occurances"
                                value={occurance}
                                label="Occurance"
                                onChange={handleOccuranceChange}
                            >
                                {menuItems}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="option">Item</InputLabel>
                            <Select
                                labelId="option"
                                id="option"
                                value={selectedOption}
                                label="Item"
                                onChange={handleOptionChange}
                            >
                                <MenuItem value={"tracks"}>Tracks</MenuItem>
                                <MenuItem value={"artists"}>Artists</MenuItem>
                                <MenuItem value={"albums"}>Albums</MenuItem>
                            </Select>
                        </FormControl>
                        {/* </Box> */}
                    </Grid>
                    {data[selectedOption]
                        .filter((item) => item.years.length === occurance)
                        .map((item) => (
                            <Grid item key={item.id} xs="auto">
                                <TrackCard item={item} />
                            </Grid>
                        ))}
                </Grid>
            </Paper>
        </>
    )

}