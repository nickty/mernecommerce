const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')

const catchAsynicErrors = require('../middlewares/catchAsyncErrors')

const APIFeatures = require('../utils/apiFeatures')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const crypto = require('crypto')


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

//Forgot pasworkd => /api/v1/password/forgot
exports.forgotPassword = catchAsynicErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404))
    }

    //Get reset token 
    const resetToken = user.getResetPasswordToken(); 

    await user.save({validateBeforeSave: false})

    //Create reset password url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is as follow: \n\n${resetUrl}\n\n if you have not requested this email, then ignore it`

    try {

        await sendEmail({
            email: user.email, 
            subject: 'Shopit password recovery',
            message
        })

        res.status(200).json({
            success: true, 
            message: `Email sent to: ${user.email}`
        })
        
    } catch (error) {
        user.getResetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500))
    }
})

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsynicErrors(async (req, res, next) => {
    // Hash URL token 

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: {$gt: Date.now()}
    })

    //console.log('working')

    if(!user){
        return next(new ErrorHandler('Password reset token in invalid', 400))
    }

    if(req.body.password !== req.body.confirmedPassword){
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password 
    user.password = req.body.password

    user.getResetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
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