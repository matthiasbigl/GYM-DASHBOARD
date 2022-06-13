import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import {DataGrid} from '@mui/x-data-grid'
import axios from "axios";


function Mitgliedschaften() {
    const [mitgliedschaftliste, setMitgliedschaftliste] = React.useState([]);
    const [sendRequest, setSendRequest] = React.useState(false);

    const columns = [
        {field: 'MitgliedschaftID', headerName: 'ID', flex:0.1},
        {field: 'Abonnement', headerName: 'Abonnement', flex:1},
        {field:  'Preis', headerName: 'Preis', flex:0.5},
        {field: 'Saunazugang',type:'boolean', headerName: 'Sauna', flex:0.5},
        {field: 'Gruppentraining',type:'boolean', headerName: 'Gruppentraining', flex:0.5},
        {field: 'Getränkespender',type:'boolean', headerName: 'Getränkespender', flex:0.5},
        {field: 'Massageliegen', type:'boolean',headerName: 'Massageliegen', flex:0.5},
        {field: 'Solarium',type:'boolean', headerName: 'Solarium', flex:0.5},


    ];


    //a function to get the data from the server and set it to the state that automatically updates the view and
    //the state is used to update the view
    //no need to call this function manually
    //automatically refreshes the data every 5seconds


    useEffect(() => {

        let isCancled = false;

       getMitgliedschaftliste()
        //call get mitgliedschaftliste every 10 seconds
        setInterval(() => {
          getMitgliedschaftliste()
        }, 10000);


        return () => {
            isCancled = true;
        }


    }, []);
    function getMitgliedschaftliste() {
        axios.get('http://172.18.8.52:3001/mitgliedschaften')
            .then(response => {
                response.data.forEach(element => {
                    element.Preis = element.Preis + "€";
                });
                setMitgliedschaftliste(response.data);
                setSendRequest(false);
            })
            .catch(error => {
                console.log(error);
            });
        setSendRequest(true);
    }


    return (

                <DataGrid


                    style={{backgroundColor: '#333333'}}
                    getRowId={(rowData) => rowData.MitgliedschaftID}
                    rows={mitgliedschaftliste}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                    autoHeight{...mitgliedschaftliste}

                />

    );

}

export default Mitgliedschaften;
