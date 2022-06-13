import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import Box from "@mui/material/Box";
import {DataGrid} from '@mui/x-data-grid'

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
    Button,
    MenuItem,
    TextField
} from "@mui/material";
import axios from "axios";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";


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
        height: '65vh',
        backgroundColor: '#333333'
    },

    actionButtonParent: {
        display: 'flex',
        flexDirection: 'row',
        gap: '2em',
        width: '100%',


    },
    actionButton: {
        flex: '1',
    },


});


function Mitglieder() {
    const mitglieder = useStyles();

    const [vorname, setVorname] = React.useState('');
    const [nachname, setNachname] = React.useState('');
    const [mitgliedschaft, setMitgliedschaft] = React.useState(1);
    const [birthday, setBirthday] = React.useState(new Date(2004, 5, 8));
    const [mitgliedliste, setMitgliedliste] = React.useState([]);
    const [trainer, setTrainer] = React.useState(1);
    const [sendRequest, setSendRequest] = React.useState(false);
    const [selectionModel, setSelectionModel] = React.useState([]);

    const [open, setOpen] = React.useState(false);


    const columns = [         {field: 'ID', headerName: 'ID', flex: 0.1},
        {field: 'Vornamen', headerName: 'Vorname', flex: 0.5},
        {field: 'Nachname', headerName: 'Nachname', flex: 1},
        {field: 'Abonnement', headerName: 'Mitgliedschaft', flex: 0.5},
        {field: 'Geburtstag', headerName: 'Geburtstag', flex: 0.5},
        {field: 'Alter', headerName: 'Alter', flex: 0.5},
        {field: 'trainer', headerName: 'Trainer', flex: 0.5},
        {
            field: "Actions", headerName: "Actions", flex: 1,
            renderCell: (cellValues) => {

                return (
                    <div className={mitglieder.actionButtonParent}>
                        <Button variant="contained"
                                startIcon={<DeleteIcon/>}
                                color="error"
                                className={mitglieder.actionButton}
                                onClick={() => {

                                    deletePerson(cellValues.id)
                                }}
                        href={`/mitglieder/${cellValues.id}`}>
                        >
                            Delete
                        </Button>
                        {/*
                            <Button variant="contained" startIcon={<EditIcon/>} className={mitglieder.actionButton}>
                                Edit
                            </Button>*/
                        }

                    </div>


                )
                    ;
            }
        }

    ];


    const [trainerListe, setTrainerListe] = React.useState([]);
    const [mitgliedschaftListe, setMitgliedschaftListe] = React.useState([]);
    //fill the trainerliste with information from the database
    useEffect(() => {
        axios.get('http://172.18.8.52:3001/trainer/all')
            .then(response => {
                response.data.forEach(trainer => {
                    //check if the trainer is already in the list
                    if (!trainerListe.some(trainer => trainer.ID === trainer.ID)) {

                        setTrainerListe(trainerListe => [...trainerListe, {
                                ID: trainer.TrainerID,
                                label: trainer.Vorname + ' ' + trainer.Nachname
                            }]
                        )

                    }


                })

            })
            .catch(error => {
                console.log(error)
            })
        axios.get('http://172.18.8.52:3001/mitgliedschaften')
            .then(response => {
                response.data.forEach(mitgliedschaft => {
                    //check if the mitgliedschaft is already in the list
                    if (!mitgliedschaftListe.some(mitgliedschaft => mitgliedschaft.ID === mitgliedschaft.ID)) {

                        setMitgliedschaftListe(mitgliedschaftListe => [...mitgliedschaftListe, {
                                ID: mitgliedschaft.MitgliedschaftID,
                                label: mitgliedschaft.Abonnement
                            }]
                        )

                    }


                })

            })
            .catch(error => {
                console.log(error)
            })
    }, []);


    useEffect(() => {

        getMitglieder()
        setInterval(() => {
            getMitglieder()
        }, 5000);


    }, [sendRequest]);

    function getMitglieder() {
        axios.get('http://172.18.8.52:3001/mitglieder')
            .then(response => {
                handleFormatting(response.data)
               // setSendRequest(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function handleFormatting(mitgliedliste) {

        console.log(mitgliedliste)

        //set all trainer to trainer_vorname + trainer_nachname
        mitgliedliste.forEach(mitglied => {
            if(mitglied.trainer_vorname !== null && mitglied.trainer_nachname !== null){
                mitglied.trainer = mitglied.trainer_vorname + ' ' + mitglied.trainer_nachname
            }
            else{
                mitglied.trainer = 'Kein Trainer'
            }
          //  mitglied.trainer = mitglied.trainer_vorname + ' ' + mitglied.trainer_nachname;
            mitglied.Geburtstag=new Date(mitglied.Geburtstag).toLocaleDateString();
        })


    /*    for (let i = 0; i < mitgliedliste.length; i++) {

            //if there is no trainer in the database, set the trainer to an empty string
            if (mitgliedliste[i].TrainerID === null) {
                mitgliedliste[i].trainer = ''
            }
            else{
                mitgliedliste[i].trainer = mitgliedliste[i].trainer_vorname + ' ' + mitgliedliste[i].trainer_nachname;

            }
            mitgliedliste[i].Geburtstag = new Date(mitgliedliste[i].Geburtstag).toLocaleDateString('de-DE')

        }*/


        setMitgliedliste(mitgliedliste);


    }


    function deletePerson(ID) {
        axios.delete('http://172.18.8.52:3001/delete/mitglied/' + ID)
            .then(response => {
                console.log(response.data);
                getMitglieder();
            })
            .catch(error => {
                console.log(error);
            });

    }

    function addPerson() {

        //check if all fields are filled
        if (vorname === '' || nachname === '' || birthday === '' || mitgliedschaft === '') {
            setOpen(true);
            return;
        }

        axios.post('http://172.18.8.52:3001/create-user', {
            nachname: nachname,
            vorname: vorname,
            mitgliedschaft: mitgliedschaft,
            trainer: trainer,
            birthday: birthday
        }).then(function (response) {
            setSendRequest(true);
        }).catch(function (error) {
            console.log(error);
        });
        //reset all the inputs
        setNachname('');
        setVorname('');
        setMitgliedschaft('');
        setTrainer(0);
        setBirthday(new Date());


    }


    function handleClose() {
        setOpen(false);
    }

    return (
        <div className={mitglieder.container}>
            <div>
                <DataGrid
                    className={mitglieder.table}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    getRowId={(rowData) => rowData.ID}
                    rows={mitgliedliste}
                    columns={columns}


                    /* checkboxSelection
                     onSelectionModelChange={(newSelectionModel) => {
                         setSelectionModel(newSelectionModel);
                         console.log(newSelectionModel);
                     }}
                     selectionModel={selectionModel}*/

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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div className={mitglieder.inputs}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Vorname"
                            value={vorname}
                            onChange={(e) => setVorname(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Nachname"
                            value={nachname}
                            onChange={(e) => setNachname(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            select
                            label="Mitgliedschaft"
                            value={mitgliedschaft}
                            //set the value of the trainer on change
                            onChange={(e) => setMitgliedschaft(e.target.value)

                            }
                        >

                            {mitgliedschaftListe.map((option) => (
                                <MenuItem key={option.ID} value={option.ID}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <DatePicker
                            disableFuture
                            label="Geburtsdatum"
                            openTo="year"
                            views={['year', 'month', 'day']}
                            value={birthday}
                            onChange={(date) => setBirthday(date)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TextField
                            id="outlined-required"
                            select
                            label="Trainer"
                            value={trainer}
                            //set the value of the trainer on change
                            onChange={(e) => setTrainer(e.target.value)

                            }
                        >

                            {trainerListe.map((option) => (
                                <MenuItem key={option.ID} value={option.ID}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div>
                            <Button variant={"contained"} className={mitglieder.addButton} onClick={addPerson}>
                                Person Hinzufügen
                            </Button>


                        </div>


                    </div>
                </LocalizationProvider>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Bitte füllen Sie alle notwendigen Felder aus"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Die Person wurde nicht hinzugefügt.<br/>
                        Bitte füllen Sie alle notwendigen Felder aus.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default Mitglieder;
