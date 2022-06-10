const express = require('express');
const mysql = require("mysql");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fitnesstudio'
});

app.post("/create-user", (req, res) => {
    console.log(req.body);
    const {nachname, vorname, mitgliedschaft, birthday, trainer} = req.body;
    let query;
    if (trainer == null||trainer == undefined||trainer===0) {
        query = `INSERT INTO fitnesstudio.kunden (Nachname, Vornamen, Mitgliedschaft, Geburtstag)
                 VALUES ('${nachname}', '${vorname}', '${mitgliedschaft}', '${birthday}')`;

    } else {
        query = `INSERT INTO fitnesstudio.kunden (Nachname, Vornamen, Mitgliedschaft, Geburtstag, Trainer)
                 VALUES ('${nachname}', '${vorname}', '${mitgliedschaft}', '${birthday}', ${trainer})`;

    }
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});


app.get("/mitgliedschaft/:id", (req, res) => {
    const {id} = req.params;
    const query = `SELECT Abonnement
                   FROM mitgliedschaften
                   WHERE MitgliedschaftID = ${id}`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});


app.get("/trainer/:id", (req, res) => {
    const {id} = req.params;
    let query = ``;
    if (id == "all") {
        query = `SELECT *
                 FROM trainer`;
    } else {
        query = `SELECT Vorname, Nachname
                 FROM trainer
                 WHERE TrainerID = ${id}`;
    }

    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

//delete mitglied by id
app.delete("/delete/mitglied/:id", (req, res) => {
    const {id} = req.params;
    const query = `DELETE
                   FROM fitnesstudio.kunden
                   WHERE ID = ${id}`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/mitglieder', (req, res) => {


    //select * from kunden and the trainer vorname and nachname from the trainer table where the trainer id is the trainer
    // id from the kunden table also select the mitgliedschaft name from the mitgliedschaften table where the mitgliedschaft id is the mitgliedschaft id from the kunden table
    const query = `SELECT kunden.ID,
                          kunden.Nachname,
                          kunden.Vornamen,
                          kunden.Geburtstag,
                          kunden.Mitgliedschaft,
                          kunden.Alter,
                          trainer.Vorname  as "trainer_vorname",
                          trainer.Nachname as "trainer_nachname",
                          mitgliedschaften.Abonnement
                   FROM kunden
                            LEFT JOIN trainer ON kunden.Trainer = trainer.TrainerID
                            LEFT JOIN mitgliedschaften ON kunden.Mitgliedschaft = mitgliedschaften.MitgliedschaftID`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/mitgliedschaften', (req, res) => {
    const query = `SELECT *
                   FROM mitgliedschaften`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/trainer', (req, res) => {
    const query = `SELECT *
                   FROM trainer`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

//a methode to get the column information of a table
app.get('/columns/:table', (req, res) => {
    const {table} = req.params;
    const query = `SELECT COLUMN_NAME
                   FROM INFORMATION_SCHEMA.COLUMNS
                   WHERE TABLE_NAME = '${table}'`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
