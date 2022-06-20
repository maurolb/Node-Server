const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
    
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: false,
            // useFindAndModify: false   
        });

        console.log('Connected database');

    } catch (error) {
        console.log(error);
        throw new Error('Error trying to connect to database ');    
    }

}

module.exports = {
    dbConnection,
}