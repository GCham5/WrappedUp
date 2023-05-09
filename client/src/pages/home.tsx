import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState, useContext } from 'react'
import Trends from '@/components/Trends/Trends'
import Insights from '@/components/Insights/Insights'
import AllPlaylists from '@/components/AllPlaylists'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Button, styled } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { makeStyles } from '@mui/material/styles';
import Navbar from '@/components/Navbar'

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1,
//         backgroundColor: theme.palette.background.paper,
//         display: 'flex',
//         height: 224,
//     },
//     tabs: {
//         borderRight: `1px solid ${theme.palette.divider}`,
//     },
//     tab: {
//         minWidth: 0,
//         width: 'auto',
//         padding: '6px 16px',
//         borderTopLeftRadius: '10px',
//         borderTopRightRadius: '10px',
//         borderBottom: 'none',
//         marginRight: '8px',
//         background: 'white',
//         boxShadow: 'inset 0px 2px 2px rgba(0, 0, 0, 0.1)',
//         zIndex: 1,
//         position: 'relative',
//         '&:before': {
//             content: '""',
//             position: 'absolute',
//             top: '100%',
//             left: 0,
//             right: 0,
//             height: '10px',
//             zIndex: -1,
//             borderBottomRightRadius: '10px',
//             borderBottomLeftRadius: '10px',
//             boxShadow: 'inset 0px 2px 2px rgba(0, 0, 0, 0.1)',
//         },
//     },
//     selected: {
//         background: theme.palette.primary.main,
//         color: theme.palette.primary.contrastText,
//         '&:before': {
//             display: 'none',
//         },
//     },
// }));


// const CustomizedTabs = styled(Tabs)({
//     '& .MuiTabs-indicator': {
//         backgroundColor: '#00bcd4',
//     },
//     '& .MuiTab-root': {
//         textTransform: 'none',
//         minWidth: 0,
//         marginRight: '16px',
//         color: 'rgba(0, 0, 0, 0.54)',
//         opacity: 1,
//         fontWeight: 400,
//         fontSize: '1rem',
//         fontFamily: [
//             // '-apple-system',
//             // 'BlinkMacSystemFont',
//             // '"Segoe UI"',
//             // 'Roboto',
//             '"Helvetica Neue"',
//             // 'Arial',
//             // 'sans-serif',
//             // '"Apple Color Emoji"',
//             // '"Segoe UI Emoji"',
//             // '"Segoe UI Symbol"',
//         ].join(','),
//         '&.Mui-selected': {
//             color: '#00bcd4',
//             fontWeight: 500,
//         },
//     },
//     '& .MuiTab-textColorPrimary.Mui-selected': {
//         color: '#00bcd4',
//     },
// });

const CustomizedTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        minWidth: 0,
        marginRight: '16px',
        color: 'rgba(0, 0, 0, 0.54)',
        opacity: 1,
        fontWeight: 400,
        fontSize: '1rem',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&.Mui-selected': {
            color: '#000',
            fontWeight: 500,
            background: 'white',
            borderTop: '2px solid #007aff',
            borderBottom: 'none',
            borderLeft: '1px solid #d3d3d3',
            borderRight: '1px solid #d3d3d3',
            borderRadius: '10px 10px 0 0',
            zIndex: 1,
            position: 'relative',
            '&:after': {
                content: '""',
                position: 'absolute',
                top: '-2px',
                left: '-1px',
                right: '-1px',
                height: '2px',
                background: 'white',
                zIndex: 2,
            },
            '&:before': {
                content: '""',
                position: 'absolute',
                bottom: '-1px',
                left: '-1px',
                right: '-1px',
                height: '1px',
                background: '#d3d3d3',
                zIndex: 2,
            },
        },
    },
});


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
        color: string;
        dance: number;
        mood: number;
        popularity: number;
        audioFeatures: any; // cleanup
        artists: {
            id: {
                name: string,
                count: number,
                images: any[]
            }
        },
        albums: {
            id: {
                name: string,
                count: number,
                images: any[]
            }
        },
        genres: {
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
    // const { user, setUserContext } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('Trends');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('')

    const clearQueryParams = () => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    };

    const sectionRef = useRef(null);

    const handleTabClick = (tab) => {
        console.log('homeeeeeeeee', tab)
        setActiveTab(tab);
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {

        // TODO: make this its own function
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const code = urlParams.get('code')

        // localStorage.setItem('access_token', accessToken);
        // localStorage.setItem('refresh_token', refreshToken);
        // setAccessToken(accessToken)
        // setRefreshToken(refreshToken)


        async function authorize() {
            // on refresh, it sends the code again which isn't allowed since the code has already been used
            // hence I call ClearQueryParameters after this to ensure this only ever gets called on initial load
            if (code) {
                const res = await fetch('http://localhost:5001/authorize', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${code}`
                    },
                    credentials: 'include'
                });
                return await res.json();
            } else {
                // no code which means params have been cleared - don't make call
                return ' '
            }
        }
        async function fetchWrappedPlaylists() {
            const res = await fetch('http://localhost:5001/wrapped_playlists', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${uuid}`
                },
                credentials: 'include'
            })
            const data = await res.json()
            setWrappedPlaylists(data)
            console.log(data)
        }

        async function getUser() {
            const res = await fetch('http://localhost:5001/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${uuid}`
                },
                credentials: 'include'
            })
            const data = await res.json()
            setUser(data)
            // setUserContext(data)
            console.log(data)
        }

        // getTokens();
        // window.history.pushState({}, '', window.location.pathname);
        authorize()
            .then(data => {
                getUser()
                    .then(user => {
                        fetchWrappedPlaylists();
                        clearQueryParams();
                    })
                    .catch(error => {
                        console.error(error);
                    })
            })
            .catch(error => {
                console.error(error);
            });
    }, [])


    if (wrappedPlaylists.length === 0 || !user) {
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
            <Navbar user={user} handleTabClick={handleTabClick} />
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

                        {/* <Typography variant="h2" gutterBottom>
                            WrappedUp
                        </Typography> */}

                        <Typography variant="h3" gutterBottom>
                            Hello,  {user.display_name}
                        </Typography>
                        {/* <Avatar alt={user.display_name} src={user.images[0].url} sx={{ width: 56, height: 56 }} /> */}

                    </Grid>
                    <Grid item xs={12}>
                        <AllPlaylists playlists={wrappedPlaylists.map(data => ({ id: data.id, name: data.name, year: data.year, image: data.image, url: data.url }))} />
                    </Grid>
                    {/* <Grid
                        container
                        justifyContent="center"
                        item xs={12}
                    >
                        <CustomizedTabs value={activeTab} onChange={handleTabClick} centered>
                            <Tab label="Trends" value="Trends" />
                            <Tab label="Insights" value="Insights" />
                        </CustomizedTabs>
                        <Box borderBottom={1} width="100%" borderColor="#000" /> */}

                    {/* <Button onClick={() => handleTabClick('trends')}>Trends</Button>
                        <Button onClick={() => handleTabClick('insights')}>Insights</Button> */}
                    {/* </Grid> */}

                    <Grid item xs={12} ref={sectionRef} id='homeone'>
                        {activeTab === 'Trends' && <Trends playlistData={wrappedPlaylists} userData={user} />}
                        {activeTab === 'Insights' && <Insights playlistData={wrappedPlaylists} userData={user} />}
                    </Grid>
                </Grid>

            </Box>


        </>
    )
}


