import {Schema, model} from 'mongoose'

// post schema ...
const postSchema = new Schema({
    image:{type:String, required:false},
    content:{type:String, required:false,maxLength:2000},
    ownerId:{type:String, required:false},
    likes_count:{type:Number, required:false,default:0},
    comments_count:{type:String, required:false,default:0},
    user:{type:Schema.Types.ObjectId, ref:'User'}
},
{
    timestamps:true
}
)


// post model
const Post = model('Post',postSchema)
export default Post;