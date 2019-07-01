const express = require('express')
const bodyParser = require('body-parser')
// require('express-group-routes')
const jwt = require('jsonwebtoken')
const app = express()
const expressJwt = require('express-jwt')

app.use(bodyParser.json())

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chating_db'
})

const jwtToken = expressJwt({secret:'shhhh'});

app.post('/login', (req, res)=>{
    const email = req.body.email
    const password = req.body.password

    connection.query('SELECT * FROM users WHERE email = "'+email+'" AND password = "'+password+'" ', function (err, rows, fields) {
        if (err) throw err

        if(rows.length > 0 ){
            const id = rows[0].id_users
            const name = rows[0].name
            const token = jwt.sign({  email: email }, 'shhhh')

            res.json({id,name,token:token})
        }else{
            res.json({error:'data not found'})
            // res.send(401, 'Wrond Email or Password!')
        }
    })
})

app.get('/chats',jwtToken,(req,res)=>{
       
        connection.query('SELECT * FROM chat', function (err, rows, fields) {
            if (err) throw err

            res.send(rows)
        })

 })

 app.post('/chats', (req,res)=>{
    const name = req.body.name
    const chat = req.body.chat
    const time = req.body.time

    connection.query('INSERT INTO chat (name, chat, time) VALUES( "'+name+'" , "'+chat+'" ,"'+time+'")', function (err, rows, fields) {
        if (err) throw err

        res.send(rows)
    })
})

app.patch('/chats/:id', (req, res)=>{
    const id = req.params.id
    const name = req.body.name
    const chat = req.body.chat
    const time = req.body.time
    
    connection.query('UPDATE chat SET name="'+name+'", chat="'+chat+'", time="'+time+'" WHERE id='+id+' ', function (err, rows, fields) {
        if (err) throw err

        res.send(rows)
    })
})

app.delete('/chats/:id',(req,res)=>{
    const id = req.params.id

    connection.query('DELETE FROM chat WHERE id = '+id+' ', function (err, rows, fields) {
        if (err) throw err

        res.send(rows)
    })
})



 app.listen('5000',()=> console.log("App Running!"))