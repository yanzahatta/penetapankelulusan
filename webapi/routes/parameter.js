const express = require('express');
const app = express();
const func = require('./function')
const dbPromise = require('./database')

// Menampilkan data parameter kelulusan berdasarkan tipe (1:SNMPTN 2:SBMPTN 3: S2 dan S3)
app.get('/parameter/tipe/:tipe',function(req, res){
    var tipe = req.params.tipe;
    dbPromise.any('SELECT * FROM parameter where tipependaftaran=$1',tipe)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved 1 tipe pendaftaran'
                });
        })
        .catch(function (err) {
            return next(err);
    });
})

app.get('/parameter/fakultas/:fakultas',function(req, res){
    var fakultas = req.params.fakultas;
    dbPromise.any('SELECT * FROM parameter where fakultas=$1',fakultas)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved 1 fakultas pendaftaran'
                });
        })
        .catch(function (err) {
            return next(err);
    });
})

app.get('/parameter/:fakultas/:tipe',function(req, res){
    var fakultas = req.params.fakultas;
    var tipe = req.params.tipe;
    dbPromise.any('SELECT * FROM parameter where fakultas=$1 and tipependaftaran=$2',[fakultas,tipe])
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved 1 fakultas pendaftaran'
                });
        })
        .catch(function (err) {
            return next(err);
    });
})

// Memasukkan data parameter kelulusan berdasarkan tipe pendaftaran ke database
app.post('/parameter/:tipe',function(req,res){
    var tipe=parseInt(req.params.tipe)

        func.postParameter(req.body,tipe).then(result =>{
            console.log(result)
            res.send(result)
        })
        .catch(err =>{
            console.log(err)
            res.send(err)
        })
});

//Mengupdate data parameter berdasarkan data dan fakultas
app.put('/parameter/:tipe/:fakultas',function(req,res){
    var tipe=parseInt(req.params.tipe)
    var fakultas=req.params.fakultas

    func.putParameter(req.body,tipe,fakultas).then(result =>{
        console.log(result)
        res.send(result)
    })
    .catch(err => {
    	console.log(err)
        res.send(err)
    })
});

module.exports = app;