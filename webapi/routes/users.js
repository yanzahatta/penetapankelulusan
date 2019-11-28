var express = require('express');
var app = express();
const dbPromise = require('./database')
const func = require('./function')

// app.

//mendapatkan data hasil keseluruhan kelulusan
app.get('/hasilkelulusan',function(req,res){
    func.getHasilKelulusan(function (err,data) {
        if (err) {
            res.send('Error')
        } else {
            res.send(data)
        }
    })
})

//mendapatkan data hasil kelulusan berdasarkan id
app.get('/hasilkelulusan/id/:id',function(req,res){
    var idpendaftar = parseInt(req.params.id);
    dbPromise.oneOrNone('SELECT * FROM hasil WHERE id_pendaftaran = $1',idpendaftar)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved 1 id'
                });
        })
        .catch(function (err) {
            return next(err);
    });
})

//mendapat hasil kelulusan berdasarkan fakultas
app.get('/hasilkelulusan/fakultas/:fakultas', function(req,res){
    var fakultas = req.params.fakultas;
    dbPromise.any('SELECT * FROM hasil WHERE fakultas = $1',fakultas)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved 1 fakultas'
                });
        })
        .catch(function (err) {
            return next(err);
    });
})

//mendapat hasil kelulusan berdasar tipe pendaftaran
app.get('/hasilkelulusan/tipe/:tipe', function(req,res){
    var tipe = parseInt(req.params.tipe);
    dbPromise.any('SELECT * FROM hasil WHERE tipependaftaran = $1',tipe)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved 1 jenis tipe pendaftaran'
                });
        })
        .catch(function (err) {
            console.log(err)
            return next(err);
    });
})

//mendapat hasil kelulusan berdasar nama pendaftar
app.get('/hasilkelulusan/nama/:nama', function(req,res){
    var nama = req.params.nama;
    dbPromise.any('SELECT * FROM hasil WHERE name LIKE $1',nama)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved 1 jenis tipe pendaftaran'
                });
        })
        .catch(function (err) {
            return next(err);
    });
})
module.exports = app;