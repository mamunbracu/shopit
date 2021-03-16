


const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    // user:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     ref: 'User'
    // },
    name:{
        type:String,
        required: [true, "Product name is required"],
        trim:true,
        maxLength:[100, "product Name cannot exceeded 100 character"]
    },
    price:{
        type:Number,
        required: [true, "Product price is required"],
        maxLength:[6, "product Price cannot exceeded 6 character"],
        default: 0.0
    },
    description:{
        type:String,
        required: [true, "Please Enter product description" ] 
    },
    rating:{
        type:Number,
        default:0
    },
    image:[
        {
            public_id : {
                type:String,
                // required : true
            },
            url : {
                type:String,
                // required : true
            },
        }
    ],
    category:{
        type:String,
        required: [true, "Please Select category for this product"],
        enum:{
            values:[
                'Electronics',
                'Camera',
                'Laptops', 'Accessories', 'Headphones','Food', 'Books', 'Cloths/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'
                ],
                message: "Please Select category for this product"
            },
    },

    seller:{
        type:String,
        required: [true, 'Please Enter product seller']
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref: 'User'
            },
            image:{
                type: String
            },
            name:{
                type: String,
                required: true
            },
            rating:{
                type:Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            },
            createdAt:{
                type: Date,
                default: Date.now
            },
        }
    ],
    
    numReviews:{
        type:Number,
        required: true,
        default:0
    },
    countInStock:{
        type:Number,
        required: true,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    
},{
    timestamps:true
})

module.exports = mongoose.model('Product', productSchema);
