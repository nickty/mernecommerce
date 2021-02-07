const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')

const catchAsynicErrors = require('../middlewares/catchAsyncErrors')

const APIFeatures = require('../utils/apiFeatures')
const sendToken = require('../utils/jwtToken')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')


//Register a user  => /api/v1/register

exports.registerUser = catchAsynicErrors( async(req, res, next) => {
    const {name, email, password } = req.body

    const user = await User.create({
        name, 
        email,
        password, 
        avatar: {
            public_id: '126721', 
            url: 'https://www.linkedin.com/in/mizanur-rahman-a808082a/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3Bt3nENfqcRuap1OnAe5DZjw%3D%3D'
        }
    })

    //const token = user.getJwtToken()

    // res.status(201).json({
    //     success: true, 
    //     token
    // })

    sendToken(user , 200, res)
})


//Login User => /api/v1/login
exports.loginUser = catchAsynicErrors (async (req, res, next) => {
    const {email, password} = req.body
    //check if email and password is entered by user 
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //Finding user in database 
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('Invalied Email or Password', 401))
    }

    //chek if password is correct or not 

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalied Email or Password', 401))
    }

    // const token = user.getJwtToken(); 

    // res.status(200).json({
    //     success: true, 
    //     token
    // })

    sendToken(user , 200, res)
})

//Logout user => /api/v1/logout 
exports.logout = catchAsyncErrors( async(req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()), 
        httpOnly: true
    })

    res.status(200).json({
        success: true, 
        message: 'Logged Out'
    })
})