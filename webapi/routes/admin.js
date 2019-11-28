const express = require('express'),
bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
// const PDFDocument = require('pdfkit')
const router = require('express').Router();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

const PDFDocument = require('./pdfkit-tables')

app.get("/pdf", (req,res) => {
    let tipe = req.params.tipe
    request('http://178.128.104.74/penetapankelulusan/hasilkelulusan',function(error,response,body){
        if (!error && response.statusCode == 200){
            let bod = JSON.parse(body)
            const doc = new PDFDocument()
            const filename = 'report.pdf';

            res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
            res.setHeader('Content-type', 'application/pdf');
            
            let rows = []
            for (x in bod) {
                rows[x]=[bod[x].id_pendaftaran,bod[x].name,bod[x].fakultas,bod[x].tipependaftaran]
            }
            

            const table0 = {
                headers: ['ID Pendaftaran','Nama','Fakultas','Tipe Pendaftaran'],
                rows: rows
            }
            // doc.y = 300; q
            // doc.text(,50,50)
            doc.text('Surat Keputusan Kelulusan Mahasiswa ITB',{align:'center',height:300})
            doc.moveDown().table(table0)
            doc.pipe(res)
            doc.end()
        }
    })
})

app.get("/pdf/:tipe", (req,res) => {
        let tipe = req.params.tipe
        request('http://178.128.104.74/penetapankelulusan/hasilkelulusan/tipe/'+tipe,function(error,response,body){
            if (!error && response.statusCode == 200){
                let bo = JSON.parse(body)
                let bod = bo.data
                const doc = new PDFDocument()
                const filename = 'report.pdf';

                res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
                res.setHeader('Content-type', 'application/pdf');
                
                let rows = []
                for (x in bod) {
                    rows[x]=[bod[x].id_pendaftaran,bod[x].name,bod[x].fakultas,bod[x].tipependaftaran]
                }
                

                const table0 = {
                    headers: ['ID Pendaftaran','Nama','Fakultas','Tipe Pendaftaran'],
                    rows: rows
                }
                // doc.y = 300; q
                // doc.text(,50,50)
                doc.text('Surat Keputusan Kelulusan Mahasiswa ITB',{align:'center',height:300})
                doc.moveDown().table(table0)
                doc.pipe(res)
                doc.end()
            }
        })
    })

// app.get("/generateReport", (req, res) => {
//     request('http://178.128.104.74/penetapankelulusan/hasilkelulusan',function(error,response,body){
//     if (!error && response.statusCode == 200){
// 		let bod = JSON.parse(body)
// 		ejs.renderFile(path.join(__dirname, './views/', "report-template.ejs"), {
// 			students: bod
// 		}, (err, data) => {
// 			if (err) {
// 				res.send(err);
// 			} else {
// 				let options = {
// 					"height": "11.25in",
// 					"width": "8.5in",

// 					"header": {
// 						"height": "20mm",
// 					},
// 					"footer": {
// 						"height": "20mm",
// 					},
	
// 				};
// 				pdf.create(data, options).toFile("report.pdf", function (err, data) {
// 					if (err) {
// 						res.send(err);
// 					} else {
// 						res.send("File created successfully");
// 					}
// 				});
// 			}
// 		});
//     }
// })
// })

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const func = require('./function')
const dbPromise = require('./database')
const request = require('request')

router.get('/pdf',function(req,res){

    const doc = new PDFDocument()
    let filename = 'HEHEHOHO' + '.pdf'
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    const content = "YOGS YOGS YOGS YOGS"
    doc.y = 300
    doc.text(content,50,50)
    doc.pipe(res)
    doc.end()
})

//post form
app.post('/hasilkelulusan/:id',function(req,res){
    func.postHasilID(req.body,req.params.id).then(result =>{
        console.log(result)
        res.send(result)
    })
    .catch(err => {
        res.send(err)
    })
})

//put form
app.put('/hasilkelulusan/:id',function(req,res){
	func.putHasilID(req.params.id,req.body).then(result =>{
        console.log(result)
        res.send(result)
    })
    .catch(err => {
    	console.log(err)
        res.send(err)
    })
});


app.get('/nilai/:tipe',function(req,res){
    var tipe = parseInt(req.params.tipe);
    if (tipe==1){
        func.getNilaiSNM(function (err,data) {
            if (err) {
                res.send('Error')
            } else {
                res.send(data)
            }
        })
    } else if ((tipe==2)||(tipe==3)) {
        func.getNilaiSBM(tipe, function (err,data) {
            if (err) {
                res.send('Error')
            } else {
                res.send(data)
            }
        })
    } else if ((tipe==4)||(tipe==5)) {
        func.getNilaiS2S3(tipe, function (err,data) {
            if (err) {
                res.send('Error')
            } else {
                res.send(data)
            }
        })
    } else {
        let ret = {
            status:200,
            message:'Wrong type'
        };
        res.statusCode = 200;
        res.message = ret;
        res.send(ret);
    } 
})


// Get nilai mahasiswa berdasarkan id
app.get('/nilai/:tipe/:id',function(req,res){
    var tipe = parseInt(req.params.tipe);
    var idpendaftar = parseInt(req.params.id);

    if (tipe==1){
        dbPromise.oneOrNone('SELECT * FROM nilaisnmptn WHERE id_pendaftaran = $1',idpendaftar)
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
    } else if (tipe==2) {
        dbPromise.oneOrNone('SELECT * FROM nilaisbmptn WHERE id_pendaftaran = $1',idpendaftar)
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
    } else if (tipe==3){
        dbPromise.oneOrNone('SELECT * FROM nilais2s3 WHERE id_pendaftaran = $1',idpendaftar)
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
    } else {
        let ret = {
            status:200,
            message:'Wrong type'
        };
        res.statusCode = 200;
        res.message = ret;
        res.send(ret);
    }
    
})

app.post('/nilai/:tipe',function(req,res){
    var tipe=parseInt(req.params.tipe)

    if(tipe==1){
        func.postNilaiSNMbyID(req.body,tipe).then(result =>{
            console.log(result)
            res.send(result)
        })
        .catch(err =>{
            console.log(err)
            res.send(err)
        })
    }else if((tipe==2)||(tipe==3)){
        func.postNilaiSBMbyID(req.body,tipe).then(result =>{
            console.log(result)
            res.send(result)
        })
        .catch(err =>{
            console.log(err)
            res.send(err)
        })
    }else if((tipe==4)||(tipe==5)){
        func.postNilais2s3byID(req.body,tipe).then(result =>{
            console.log(result)
            res.send(result)
        })
        .catch(err =>{
            console.log(err)
            res.send(err)
        })
    }	
});


app.get('/penilaianKelulusan/:tipe/',function(req,res){
    let tipe = req.params.tipe
    request('http://178.128.104.74/penetapankelulusan/nilai/'+tipe,function(error,response,body){
        if (!error && response.statusCode == 200){
            bod=JSON.parse(body)
            let pilihan = 1
            for (var i in bod){
                let id = bod[i].id_pendaftaran
                let tipependaftaran = bod[i].tipependaftaran
                func.penilaianKelulusan(id,tipependaftaran,pilihan,function(err,ret){
                    if (err) {
                        let error = "error pada id "+id_pendaftaran+" dengan tipependaftaran "+tipependaftaran+" pilihan "+pilihan
                        res.statusCode = 404
                        res.send(error)
                    } 
                })
            }
            pilihan=2
            for (var i in bod){
                let id = bod[i].id_pendaftaran
                let tipependaftaran = bod[i].tipependaftaran
                func.penilaianKelulusan(id,tipependaftaran,pilihan,function(err,ret){
                    if (err) {
                        let error = "error pada id "+id_pendaftaran+" dengan tipependaftaran "+tipependaftaran+" pilihan "+pilihan
                        res.statusCode = 404
                        res.send(error)
                    } 
                })
            }
            res.send({"response-code":200,"message":"Semua telah berhasil dinilai"})
        } else {
           console.log(error)
           res.send({"response-code":200,"message":"Error: cannot connect to nilai"}) 
        }
    })
})

module.exports = app;
