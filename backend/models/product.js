const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please Enter Product name'], 
        trim: true, 
        maxlength: [100, 'Product name cannot exceed 100 chars']
    }, 
    price: {
        type: Number, 
        required: [true, 'Please Enter Product name'], 
        maxlength: [5, 'Product price can not be that much'], 
        default: 0.0
    }, 
    description: {
        type: String, 
        required: [true, 'Please Enter Product name'], 
        
  
    },
    ratings: {
        type: Number, 
        default: 0
    }, 
    images: [
        {
            public_id: {
                type: String, 
                required: true
            }, 
            url: {
                type: String, 
                required: true
            }
        }
    ], 
    category: {
        type: String, 
        required: [true, 'Please select category for this product'], 
        enum: {
            values: [
                'Electronics', 
                'Cameras', 
                'Laptops', 
                'Accessories', 
                'Headphones', 
                'Food', 
                'Books', 
                'Cloth/health', 
                'Sports', 
                'Outdoor', 
                'Home'
            ], 
            message: 'Please select correct category for products'
        }
    }, 
    seller: {
        type: String, 
        required: [true, 'Please enter product seller']
    }, 
    stock: {
        type: Number, 
        required: [true, 'Please enter product stock'], 
        maxlength: [5, 'You can not stock more than 5'], 
        default: 0
    }, 
    numOfReviews: {
        type: Number, 
        default: 0
    }, 
    reviews: [
        {
            name: {
                type: String, 
                required: true
            }, 
            rating: {
                type: Number, 
                required: true
            }, 
            comment: {
                type : String,
                required: true 

            }
        }
    ], 
    createdAt: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema)