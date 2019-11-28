const Express = require('express')
const bodyParser = require('body-parser')
// const cors = require('cors')
const path = require('path')
const router = Express.Router()

const app = Express()
const port = 3000   


var userRouter = require('./routes/users')
var adminRouter = require('./routes/admin')
var paramRouter = require('./routes/parameter')

app.use(bodyParser())

// router.get('/admin',function(req,res){
//     res.sendFile(path.join(__dirname+'/index.html'))
// })

// router.get('/user',function(req,res){
//     res.sendFile(path.join(__dirname+'/user.html'))
// })
// app.use('/',router)


app.set('view engine','ejs');


app.use(userRouter)
app.use(adminRouter)
app.use(paramRouter)

app.listen(port, ()=>console.log('localhost:3000'))