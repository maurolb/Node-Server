const cors = require('cors')
const express = require('express');

class Server {

    constructor(){
        this.app = express();
        this.PORT = process.env.PORT;
        this.userPath = '/api/users';
        
        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
        
        // Directorio Público
        this.app.use(express.static('public'))
    }

    routes(){
        this.app.use(this.userPath, require('../routes/users'))
    }

    listen(){
        this.app.listen(this.PORT, () => {
            console.log('Server runnning on port ', this.PORT);
        });
    }
}

module.exports = Server;