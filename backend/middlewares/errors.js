const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error'
    
    if(process.env.NODE_ENV === 'development'){
        res.status(err.statusCode).json({
            success: false, 
            error: err,
            errMesssage: err.message,
            stack: err.stack
        })
    }

    // res.status(err.statusCode).json({
    //     success: false, 
    //     error: err.stack
    // })

    if(process.env.NODE_ENV === 'production'){
        let error = {...err}
        error.message = err.message

        //wrong mongoose object id error
        if(err.name === 'CastError'){
            const message = `Resource not found, Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //Hanlading mongoose validation error 
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 400)
        }

        //Handing Mosgoose duplicate error 
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

        //Handeling wrong JwT error 
        if(err.name === 'JsonWebTokenError'){
            const message = 'JSON Wen Token is invalid'
            error = new ErrorHandler(message, 400)
        }

         //Handeling expired JwT error 
         if(err.name === 'TokenExpiredError'){
            const message = 'JSON Wen Token is Expired'
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false, 
            message: error.message || 'Internal Server Error'
        })
    }

    
}