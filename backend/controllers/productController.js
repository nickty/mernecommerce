const Product = require('../models/product');
const ErrorHander = require('../utils/errorHandler');

const catchAsynicErrors = require('../middlewares/catchAsyncErrors')

const APIFeatures = require('../utils/apiFeatures')

//Create new product => /api/v1/product/new
exports.newProduct = catchAsynicErrors (async (req, res, next) => {

    
    const product = await Product.create(req.body); 

    res.status(201).json({
        success: true, 
        product
    })
})

//get all products => /api/v1/products

exports.getProducts = catchAsynicErrors (async (req, res, next) => {

    const resPerPage = 4; 

    const productCount = await Product.countDocuments(); 

    const apiFeature = new APIFeatures(Product.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage)

                    
    const products = await apiFeature.query

    res.status(200).json({
        success: true, 
        count: products.length,
        productCount,
        products
    })
})

//get signle product details => /api/v1/product/:id
exports.getSingleProduct = catchAsynicErrors (async (req, res, next) =>{
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHander('Product not found', 404))
    }

    res.status(200).json({
        success: true, 
        product
    })
})

//update the product => /api/v1/product/:id
exports.updateProduct = catchAsynicErrors (async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHander('Product not found', 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false
    })

    res.status(200).json({
        success: true, 
        product
    })
})

//Delete product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsynicErrors (async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHander('Product not found', 404))
    }

    await product.remove()

    res.status(200).json({
        success: true, 
        message: 'Product is deleted'
    })
})