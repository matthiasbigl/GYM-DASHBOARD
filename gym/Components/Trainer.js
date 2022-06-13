import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import Box from "@mui/material/Box";
import {DataGrid} from '@mui/x-data-grid'
import {
    Button,
    TextField
} from "@mui/material";
import axios from "axios";

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '10px',
    },
    label: {
        fontSize: '1.2rem',
    },
    addButton: {
        marginTop: '10px',
        alignSelf: 'flex-end'

    },
    inputs: {
        alignSelf: 'flex-end',
        paddingTop: '2rem',
    },
    table: {
        backgroundColor: '#333333',
        height: '65vh',
    }


});


function Trainer() {
    const trainer = useStyles();

    const [vorname, setVorname] = React.useState('');
    const [nachname, setNachname] = React.useState('');
    const [preisProStunde, setPreisProStunde] = React.useState(0);
    const [alter, setAlter] = React.useState(0);
    const [trainerliste, setTrainerliste] = React.useState([]);
    const [sendRequest, setSendRequest] = React.useState(false);

    const [selectionModel, setSelectionModel] = React.useState([]);

    const columns = [
        {field: 'TrainerID', headerName: 'ID', flex: 0.1},
        {field: 'Vorname', headerName: 'Vorname', flex: 0.5},
        {field: 'Nachname', headerName: 'Nachname', flex: 1},
        {field: 'Preis/Stunde', headerName: 'Preis pro Stunde', flex: 0.5},
        {field: 'Stunden/Woche', headerName: 'Stunden pro Woche', flex: 0.5},
        {field: 'wochengehalt', headerName: 'Wochengehalt', flex: 0.5}
        ,



    ];


    //a function to get the data from the server and set it to the state that automatically updates the view and
    //the state is used to update the view
    //no need to call this function manually
    //automatically refreshes the data every 5seconds


    useEffect(() => {

        getTrainer()
        setInterval(() => {
            getTrainer()
        }, 5000);


    }, [sendRequest]);

    function getTrainer() {
        axios.get('http://172.18.8.52:3001/trainer')
            .then(response => {
                setTrainerliste(response.data);
                setSendRequest(false);
            })
            .catch(error => {
                console.log(error);
            });
    }


    function addTrainer() {
        axios.post('http://172.18.8.52:3001/add-trainer', {
            nachname: nachname,
            vorname: vorname,
            preisProStunde: preisProStunde,
        }).then(function (response) {
            setSendRequest(true);
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });

    }


    return (
        <div className={trainer.container}>
            <div>
                <DataGrid
                    className={trainer.table}
                    getRowId={(rowData) => rowData.TrainerID}
                    rows={trainerliste}
                    columns={columns}
                    checkboxSelection
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                        console.log(newSelectionModel);
                    }}
                    selectionModel={selectionModel}

                />

            </div>

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': {m: 1, width: '25ch'},
                }}
                noValidate
                autoComplete="off"
            >
                <div className={trainer.inputs}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Vorname"
                        onChange={(e) => setVorname(e.target.value)}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="Nachname"
                        onChange={(e) => setNachname(e.target.value)}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="Preis pro Stunde"
                        type={'number'}
                        onChange={(e) => setPreisProStunde(e.target.value)}
                    />
                    <TextField
                        required
                        id="outlined-required"
                        label="Stunden pro Woche"
                        type={'number'}
                        onChange={(e) => setPreisProStunde(e.target.value)}
                    />

                    <div>
                        <Button variant={"contained"} className={trainer.addButton} onClick={addTrainer}>
                            Person Hinzufügen
                        </Button>

                    </div>


                </div>
            </Box>
        </div>
    );

}

export default Trainer;
