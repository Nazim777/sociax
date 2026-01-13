import mongoose from 'mongoose';
mongoose instanceof mongoose.Mongoose;

// Connecting the mongoose and with it's Promise..
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
};

// Mongoose Promise..
mongoose.Promise = global.Promise;

async function connectDB(URL: string) {
    const connection = await mongoose.connect(URL, mongoOptions as mongoose.MongooseOptions);
    return connection;
}

export default connectDB;