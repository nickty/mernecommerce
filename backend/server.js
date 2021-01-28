const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()

//DB connection 
mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
}).then(con => {
    console.log(`Local Server started on ${con.connection.host}`)
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})