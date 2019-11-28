const request = require('request')
const dbPromise = require('./database')

// let isEmpty = (val) => {
//     let typeOfVal = typeof val;
//     switch(typeOfVal){
//         case 'object':
//             return (!Object.keys(val).length ||  (val.length == 0));
//             break;
//         case 'string':
//             let str = val.trim();
//             return str == '' || str == undefined || str==null;
//             break;
//         case 'number':
//             return val == '';
//             break;
//         default:
//             return val == '' || val == undefined;
//     }
// };

function isEmptyObject(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }

//tipe = tipe DB, karena 1 database itu ada beberapa tipe pendaftaran
function penilaianKelulusan(id,tipependaftaran,pilihan,callback){
    try{
        //cek apakah ada di database hasil
        request('http://178.128.104.74/penetapankelulusan/hasilkelulusan/id/'+id,function(error,response,body){
            if (!error && response.statusCode == 200){
                let bod = JSON.parse(body)
                if (!isEmptyObject((bod.data))){
                    let ret = ({"response-code":200,"message":"Telah lulus seleksi"})
                    console.log(id+" telah lulus seleksi")
                    callback(error,ret)
                }
                else {
                    let tipeahaha = tipependaftaran
                    let tipe = tipependaftaran
                    if ((tipependaftaran==2)||(tipependaftaran==3)){
                        tipe = 2
                    } else if ((tipependaftaran==4)||(tipependaftaran==5)){
                        tipe = 3
                    }
                    request('http://178.128.104.74/penetapankelulusan/nilai/'+tipe+'/'+id,function(error,response,body){
                    if (!error && response.statusCode == 200){
                       let bod = JSON.parse(body)
                       let name = bod.data.name
                       let tipependaftaran = bod.data.tipependaftaran
                       let fakultas = bod.data.fakultas1
                       if (pilihan==2){
                           fakultas = bod.data.fakultas2
                        }
                       if (tipe==1){
                           let nilai = [bod.data.indekssekolah,bod.data.raportmat,bod.data.raportfisika,bod.data.raportkimia,bod.data.raportbiologi,bod.data.raportgeografi,bod.data.raportsosiologi,bod.data.raportsejarah,bod.data.raportekonomi]
                           request('http://178.128.104.74/penetapankelulusan/parameter/'+fakultas+'/'+tipependaftaran,function(error,response,body){
                               if (!error && response.statusCode==200){
                                    let bod = JSON.parse(body) 
                                   let hasil = [bod.data[0].idekssekolah,bod.data[0].raportmat,bod.data[0].raportfisika,bod.data[0].raportkimia,bod.data[0].raportbiologi,bod.data[0].raportgeografi,bod.data[0].raportsosiologi,bod.data[0].raportsejarah,bod.data[0].raportekonomi]  
                                   let passinggrade = bod.data[0].passinggrade
                                   let sumpg=0
                                   for(var i in hasil){
                                       sumpg+=hasil[i]
                                   }
                                   let sum = 0
                                   for(var i in nilai){
                                       sum+=(nilai[i]*hasil[i])/sumpg
                                    }
                                    console.log("dapat sumnya segini "+sum)
                                    console.log("passinggradenya segini "+passinggrade)
                                    if (sum>=passinggrade){
                                        request({
                                            method:'POST',
                                            url:'http://178.128.104.74/penetapankelulusan/hasilkelulusan/'+id,
                                            body:{
                                                name:name,
                                                fakultas:fakultas,
                                                tipependaftaran:tipependaftaran
                                            },
                                            json:true   
                                        },function(err,result,body){
                                            if (err) {
                                                throw err
                                            } else {
                                                let ret = ({"response-code":200,"message":"Record successfully added to HasilKelulusan"})
                                                console.log("lulus cuy "+id+' dan tipe pendaftaran '+tipeahaha)
                                                callback(err,ret)
                                            }
                                        })
                                    } else { //tidak lulus
                                        let ret = ({"response-code":200,"message":"Tidak berhasil lulus seleksi"})
                                        console.log("galulus lo "+id+' dan tipe pendaftaran '+tipeahaha)
                                        callback(error,ret) 
                                    }
                                } else { //if error
                                    throw error;
                                }
                            })
                        } else if (tipe==2){
                            let nilai = [bod.data.tps,bod.data.tkamatematika,bod.data.tkafisika,bod.data.tkakimia,bod.data.tkabiologi,bod.data.tkageografi,bod.data.tkasosiologi,bod.data.tkasejarah,bod.data.tkaekonomi]
                            request('http://178.128.104.74/penetapankelulusan/parameter/'+fakultas+'/'+tipependaftaran,function(error,response,body){
                               if (!error && response.statusCode==200){
                                   let bod = JSON.parse(body) 
                                   let hasil = [bod.data[0].tps,bod.data[0].tkamatematika,bod.data[0].tkafsika,bod.data[0].tkakimia,bod.data[0].tkabiologi,bod.data[0].tkageografi,bod.data[0].tkasosiologi,bod.data[0].tkasejarah,bod.data[0].tkaekonomi]  
                                   let passinggrade = bod.data[0].passinggrade
                                   let sumpg=0
                                   for(var i in hasil){
                                       sumpg+=hasil[i]
                                   }
                                   let sum = 0
                                   for(var i in nilai){
                                       sum+=(nilai[i]*hasil[i])/sumpg
                                    }
                                    if (sum>=passinggrade){
                                        request({
                                            method:'POST',
                                            url:'http://178.128.104.74/penetapankelulusan/hasilkelulusan/'+id,
                                            body:{
                                                name:name,
                                                fakultas:fakultas,
                                                tipependaftaran:tipependaftaran
                                            },
                                            json:true  
                                        },function(err,result,body){
                                            if (err) {
                                                throw err
                                            } else {
                                                let ret = ({"response-code":200,"message":"Record successfully added to HasilKelulusan"})
                                                callback(err,ret)
                                            }
                                        })
                                    } else { //tidak lulus
                                        let ret = ({"response-code":200,"message":"Tidak berhasil lulus seleksi"})
                                        callback(error,ret) 
                                    }
                                } else { //if error
                                    throw error;
                                }
                            })
                        } else if (tipe==3){
                            let nilai = [bod.data.indeksuniversitas,bod.data.ipk,bod.data.toefl_ibt,bod.data.toefl_cbt,bod.data.toefl_itp,bod.data.ielts,bod.data.tpabappenas]
                            request('http://178.128.104.74/penetapankelulusan/parameter/'+fakultas+'/'+tipependaftaran,function(error,response,body){
                               if (!error && response.statusCode==200){
                                   let bod = JSON.parse(body) 
                                   let hasil = [bod.data[0].indeksuniversitas,bod.data[0].ipk,bod.data[0].toefl_ibt,bod.data[0].toefl_cbt,bod.data[0].toefl_itp,bod.data[0].ielts,bod.data[0].tpabappenas]  
                                   let passinggrade = bod.data[0].passinggrade
                                   let sumpg=0
                                   for(var i in hasil){
                                       sumpg+=hasil[i]
                                   }
                                   let sum = 0
                                   for(var i in nilai){
                                       sum+=(nilai[i]*hasil[i])/sumpg
                                    }
                                    if (sum>=passinggrade){
                                        request({
                                            method:'POST',
                                            url:'http://178.128.104.74/penetapankelulusan/hasilkelulusan/'+id,
                                            body:{
                                                name:name,
                                                fakultas:fakultas,
                                                tipependaftaran:tipependaftaran
                                            },
                                            json:true  
                                        },function(err,result,body){
                                            if (err) {
                                                throw err
                                            } else {
                                                let ret = ({"response-code":200,"message":"Record successfully added to HasilKelulusan"})
                                                callback(err,ret)
                                            }
                                        })
                                    } else { //tidak lulus
                                        let ret = ({"response-code":200,"message":"Tidak berhasil lulus seleksi"})
                                        callback(err,ret) 
                                    }
                                } else { //if error
                                    throw error;
                                }
                            })
                        }
                    } else {throw error;}
                })
            }
        } else {throw error;}
    })
        
    } catch(err) {
        console.log(err)
    }
}

function postHasilID(data,id){
    return new Promise((resolve,reject) =>{
        dbPromise.none('INSERT INTO hasil(id_pendaftaran, name, fakultas, tipependaftaran) VALUES ($1,$2,$3,$4)', 
        [id,data.name,data.fakultas, data.tipependaftaran])
                .then(() =>{
                    console.log('Record successfully inserted');
                    resolve('Record successfully inserted')
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
    })
}

function putHasilID(id_form, data){
	return new Promise((resolve,reject) =>{
		dbPromise.none('UPDATE hasil SET name=$1, fakultas=$2, tipependaftaran= $3\
					WHERE id_pendaftaran=$4', [data.name, data.fakultas, data.tipependaftaran, id_form])
				.then(() => {
					console.log('Record successfully updated');
                    resolve('Record successfully updated')
				})
				.catch(err => {
					console.log(err)
					reject(err)
				})
	})
}

function putNilaibyID(id,data,tipe){
    if (tipe==1){
    return new Promise((resolve,reject) =>{
        dbPromise.none('UPDATE nilaisnmptn SET indekssekolah = $1 ,raportmat = $2 ,raportfisika = $3 ,raportkimia = $4 ,raportbiologi = $5 ,raportgeografi = $6 ,raportsosiologi = $7 ,raportsejarah = $8 ,raportekonomi = $9\
                    WHERE id_pendaftaran = $10', 
                    // [data.indekssekolah, data.raportmat, data.raportfisika,
                    //     data.raportkimia, data.raportbiologi, data.raportgeografi,
                    //     data.raportsosiologi, data.raportsejarah, data.raportekonomi,
                    //     id]
                        [data.param1, data.param2, data.param3,
                            data.param4, data.param5, data.param6,
                            data.param7, data.param8, data.param9,
                            id]
                        )
				.then(() => {
					console.log('Record successfully updated');
                    resolve('Record successfully updated')
				})
				.catch(err => {
					console.log(err)
					reject(err)
                })
            })
        }
    else if ((tipe==2)||(tipe==3)){
        return new Promise((resolve,reject) =>{
            dbPromise.none('UPDATE nilaisbmptn SET tps = $1, tkamatematika = $2, tkafisika = $3, tkakimia = $4 ,tkabiologi = $5, tkageografi = $6, tkasosiologi = $7, tkasejarah = $8, tkaekonomi = $9\
            WHERE id_pendaftaran = $10', 
            // [data.indekssekolah, data.raportmat, data.raportfisika,
            //     data.raportkimia, data.raportbiologi, data.raportgeografi,
            //     data.raportsosiologi, data.raportsejarah, data.raportekonomi,
            [data.param1, data.param2, data.param3,
                data.param4, data.param5, data.param6,
                data.param7, data.param8, data.param9,
                id]
                )
            .then(() => {
                console.log('Record successfully updated');
                resolve('Record successfully updated')
            })
            .catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
        }
        else if ((tipe==4)||(tipe==5)){
        return new Promise((resolve,reject) =>{
                dbPromise.none('UPDATE nilais2s3 SET indeksuniversitas = $1, ipk = $2, toefl_ibt = $3, toefl_cbt = $4, toefl_itp = $5, ielts = $6, tpabappenas = $7\
                WHERE id_pendaftaran = $8', 
                // [data.indeksuniversitas, data.ipk, data.toefl_ibt,
                //     data.toefl_cbt, data.toefl_itp, data.ielts,
                //     data.tpabappenas,id]
                [data.param1, data.param2, data.param3,
                    data.param4, data.param5, data.param6,
                    data.param7,
                    id]
                )
                .then(() => {
                    console.log('Record successfully updated');
                    resolve('Record successfully updated')
                })
                .catch(err => {
                        console.log(err)
                        reject(err)
                    })
                }) 
            }
}

function postNilaiSNMbyID(id,data,tipe){
    return new Promise((resolve,reject) =>{
            dbPromise.none('INSERT INTO nilaisnmptn(id_pendaftaran, name, fakultas1, fakultas2, tipependaftaran, indekssekolah, raportmat, raportfisika, raportkimia, raportbiologi, raportgeografi, raportsosiologi, raportsejarah, raportekonomi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', 
                        // [id, data.name, data.fakultas1, data.fakultas2, tipe, data.indekssekolah, data.raportmat, data.raportfisika,
                        //     data.raportkimia, data.raportbiologi, data.raportgeografi,
                        //     data.raportsosiologi, data.raportsejarah, data.raportekonomi]
                        [id, data.name, data.fakultas1, data.fakultas2, tipe, data.param1, data.param2, data.param3,
                            data.param4, data.param5, data.param6,
                            data.param7, data.param8, data.param9]
                            )
                    .then(() => {
                        console.log('Record successfully updated');
                        resolve('Record successfully updated')
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
                })
            }


function postNilaiSBMbyID(id,data,tipe){
    return new Promise((resolve,reject) =>{
        dbPromise.none('INSERT INTO nilaisbmptn(id_pendaftaran, name, fakultas1, fakultas2, tipependaftaran, tps, tkamatematika, tkafisika, tkakimia, tkabiologi, tkageografi,tkasosiologi, tkasejarah, tkaekonomi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
    // [id, data.name, data.fakultas1, data.fakultas2, tipe, data.tps, data.tkamatematika, data.tkafisika,
    //     data.tkakimia, data.tkabiologi, data.tkageografi,
    //     data.tkasosiologi, data.tkasejarah, data.tkaekonomi]
    [id, data.name, data.fakultas1, data.fakultas2, tipe, data.param1, data.param2, data.param3,
        data.param4, data.param5, data.param6,
        data.param7, data.param8, data.param9]
        )
    .then(() => {
        console.log('Record successfully updated');
        resolve('Record successfully updated')
    })
    .catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

function postNilais2s3byID(id,data,tipe){
    return new Promise((resolve,reject) =>{
        dbPromise.none('insert into nilais2s3(id_pendaftaran, name, fakultas1, fakultas2, tipependaftaran, indeksuniversitas, ipk, toefl_ibt, toefl_cbt, toefl_itp, ielts,tpabappenas) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', 
        // [id, data.name, data.fakultas1, data.fakultas2, tipe, data.indeksuniversitas, data.ipk, data.toefl_ibt,
        //     data.toefl_cbt, data.toefl_itp, data.ielts,
        //     data.tpabappenas]
        [id, data.name, data.fakultas1, data.fakultas2, tipe, data.param1, data.param2, data.param3,
            data.param4, data.param5, data.param6,
            data.param7]
            )    
        .then(() => {
            console.log('Record successfully updated');
            resolve('Record successfully updated')
        })
        .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

function postNilaiSNMbyID(data,tipe){
    return new Promise((resolve,reject) =>{
            dbPromise.none('INSERT INTO nilaisnmptn(id_pendaftaran, name, fakultas1, fakultas2, tipependaftaran, indekssekolah, raportmat, raportfisika, raportkimia, raportbiologi, raportgeografi, raportsosiologi, raportsejarah, raportekonomi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', 
                        // [id, data.name, data.fakultas1, data.fakultas2, tipe, data.indekssekolah, data.raportmat, data.raportfisika,
                        //     data.raportkimia, data.raportbiologi, data.raportgeografi,
                        //     data.raportsosiologi, data.raportsejarah, data.raportekonomi]
                        [data.id_pendaftaran, data.name, data.fakultas1, data.fakultas2, tipe, data.param1, data.param2, data.param3,
                            data.param4, data.param5, data.param6,
                            data.param7, data.param8, data.param9]
                            )
                    .then(() => {
                        console.log('Record successfully updated');
                        resolve('Record successfully updated')
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
                })
            }


function postNilaiSBMbyID(data,tipe){
    return new Promise((resolve,reject) =>{
        dbPromise.none('INSERT INTO nilaisbmptn(id_pendaftaran, name, fakultas1, fakultas2, tipependaftaran, tps, tkamatematika, tkafisika, tkakimia, tkabiologi, tkageografi,tkasosiologi, tkasejarah, tkaekonomi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
    // [data.id, data.name, data.fakultas1, data.fakultas2, tipe, data.tps, data.tkamatematika, data.tkafisika,
    //     data.tkakimia, data.tkabiologi, data.tkageografi,
    //     data.tkasosiologi, data.tkasejarah, data.tkaekonomi]

        [data.id_pendaftaran, data.name, data.fakultas1, data.fakultas2, tipe, data.param1, data.param2, data.param3,
            data.param4, data.param5, data.param6,
            data.param7, data.param8, data.param9]
        
        )
    .then(() => {
        console.log('Record successfully updated');
        resolve('Record successfully updated')
    })
    .catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

function postNilais2s3byID(data,tipe){
    return new Promise((resolve,reject) =>{
        dbPromise.none('insert into nilais2s3(id_pendaftaran, name, fakultas1, fakultas2, tipependaftaran, indeksuniversitas, ipk, toefl_ibt, toefl_cbt, toefl_itp, ielts,tpabappenas) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', 
        // [data.id, data.name, data.fakultas1, data.fakultas2, tipe, data.indeksuniversitas, data.ipk, data.toefl_ibt,
        //     data.toefl_cbt, data.toefl_itp, data.ielts,
        //     data.tpabappenas]
        [data.id_pendaftaran, data.name, data.fakultas1, data.fakultas2, tipe, data.param1, data.param2, data.param3,
            data.param4, data.param5, data.param6,
            data.param7]
            )
        .then(() => {
            console.log('Record successfully updated');
            resolve('Record successfully updated')
        })
        .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}


// Get nilai mahasiswa pendaftar secara keseluruhan
function getNilaiSNM(callback){
    dbPromise.any('SELECT * FROM nilaisnmptn')
        .then(data => {
            callback(null,data)
        })
        .catch(err => {
            callback(err)
        })
}

function getNilaiSBM(tipe, callback){
    dbPromise.any('SELECT * FROM nilaisbmptn WHERE tipependaftaran = $1',tipe)
        .then(data => {
            callback(null,data)
        })
        .catch(err => {
            callback(err)
        })
}

function getNilaiS2S3(tipe, callback){
    dbPromise.any('SELECT * FROM nilais2s3 WHERE tipependaftaran = $1',tipe)
        .then(data => {
            callback(null,data)
        })
        .catch(err => {
            callback(err)
        })
}

function getHasilKelulusan(callback){
    dbPromise.any('SELECT * FROM hasil')
        .then(data => {
            callback(null,data)
        })
        .catch(err => {
            callback(err)
        })
}

//(1:SNMPTN 2:SBMPTN 3:Mandiri 4:S2 5:S3)
function postParameter(data,tipe){
    return new Promise((resolve,reject) =>{
            dbPromise.none('INSERT INTO parameter(fakultas, tipependaftaran, tps, tkamatematika, tkafsika, tkakimia, tkabiologi, tkageografi, tkasosiologi, tkasejarah, tkaekonomi, idekssekolah, raportmat, raportfisika, raportkimia, raportbiologi, raportgeografi, raportsosiologi, raportsejarah, raportekonomi, indeksuniversitas, ipk, toefl_ibt, toefl_cbt, toefl_itp, ielts, tpabappenas, passinggrade) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)', 
                        [data.fakultas, tipe, data.tps, data.tkamatematika, data.tkafsika, data.tkakimia, data.tkabiologi, data.tkageografi, data.tkasosiologi, data.tkasejarah, data.tkaekonomi, data.idekssekolah, data.raportmat, data.raportfisika,
                            data.raportkimia, data.raportbiologi, data.raportgeografi,
                            data.raportsosiologi, data.raportsejarah, data.raportekonomi
                        ,data.indeksuniversitas ,data.ipk, data.toefl_ibt, data.toefl_cbt
                        ,data.toefl_itp,data.ielts,data.tpabappenas,data.passinggrade])
                    .then(() => {
                        console.log('Record successfully updated');
                        resolve('Record successfully updated')
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
                })
        }


function putParameter(data,tipe,fakultas){
        return new Promise((resolve,reject) =>{
            dbPromise.none('UPDATE parameter SET tps = $3 , tkamatematika = $4, tkafsika=$5, tkakimia=$6, tkabiologi=$7, tkageografi=$8, tkasosiologi=$9, tkasejarah=$10, tkaekonomi=$11, idekssekolah=$12, raportmat = $13 ,raportfisika = $14 ,raportkimia = $15 ,raportbiologi = $16 ,raportgeografi = $17 ,raportsosiologi = $18 ,raportsejarah = $19 ,raportekonomi = $20, indeksuniversitas= $21, ipk = $22, toefl_ibt = $23, toefl_cbt = $24, toefl_itp = $25, ielts = $26, tpabappenas = $27 , passinggrade = $28 \
                        WHERE fakultas = $1 AND tipependaftaran = $2 ', 
                        [fakultas, tipe, data.tps, data.tkamatematika, data.tkafsika, data.tkakimia, 
                            data.tkabiologi, data.tkageografi, data.tkasosiologi, 
                            data.tkasejarah, data.tkaekonomi, data.idekssekolah, 
                            data.raportmat, data.raportfisika, data.raportkimia, 
                            data.raportbiologi, data.raportgeografi,
                            data.raportsosiologi, data.raportsejarah, data.raportekonomi
                        ,data.indeksuniversitas ,data.ipk, data.toefl_ibt, data.toefl_cbt
                        ,data.toefl_itp,data.ielts,data.tpabappenas,data.passinggrade])
                    .then(() => {
                        console.log('Record successfully updated');
                        resolve('Record successfully updated')
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
                })
}

module.exports.penilaianKelulusan = penilaianKelulusan
module.exports.putHasilID = putHasilID
module.exports.postHasilID = postHasilID
module.exports.putNilaibyID = putNilaibyID
module.exports.postNilaiSBMbyID = postNilaiSBMbyID
module.exports.postNilaiSNMbyID = postNilaiSNMbyID
module.exports.postNilais2s3byID = postNilais2s3byID
module.exports.getNilaiS2S3 = getNilaiS2S3
module.exports.getNilaiSBM = getNilaiSBM
module.exports.getNilaiSNM = getNilaiSNM
module.exports.getHasilKelulusan = getHasilKelulusan
module.exports.putParameter = putParameter
module.exports.postParameter = postParameter