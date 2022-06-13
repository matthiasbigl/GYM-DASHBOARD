
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {Mitglieder,Trainer,Mitgliedschaften} from "../Components";
import {useUser} from "@auth0/nextjs-auth0";
import {useRouter} from "next/router";
import {useEffect} from "react";




export default function Dashboard() {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const {user, error, isLoading} = useUser();
    const router = useRouter();
    console.log(user);

    useEffect(() => {
        if (!user) {
            router.push("/api/auth/login").then(r => {
                console.log(r);

            });
        }
        //if there is an error redirect to the login page
        if (error) {
            router.push("/api/auth/login");
        }
    }, []);





    if(user){
        return(
            <div className="App">
                <ThemeProvider theme={darkTheme}>
                    <Box sx={{width: '100%', typography: 'body1'}}>
                        <TabContext value={value}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Mitgliedschaften" value="1"/>
                                    <Tab label="Trainer" value="2"/>
                                    <Tab label="Mitglieder" value="3"/>
                                </TabList>
                            </Box>
                            <TabPanel value="1"><Mitgliedschaften/></TabPanel>
                            <TabPanel value="2"><Trainer/></TabPanel>
                            <TabPanel value="3"><Mitglieder/></TabPanel>
                        </TabContext>
                    </Box>
                </ThemeProvider>

            </div>
        )
    }
    else{
        return (<div>Loading</div>);
    }
}
