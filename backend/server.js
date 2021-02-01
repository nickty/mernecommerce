const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()

//Hanle the uncaught exccecption 
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`); 
    console.log('Shutting down due to uncaught exception'); 
    process.exit(1)
})

//console.log(a); 

//DB connection 
mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
}).then(con => {
    console.log(`Local Server started on ${con.connection.host}`)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//handle unhanled promis rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down the server due to hnalde Promise rejection'); 
    server.close(() =>{
        process.exit(1)
    })
})