const cors = require('cors')
const express = require('express');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');

class Server {

    constructor(){
        this.app    = express();
        this.PORT   = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io     = require('socket.io')(this.server);
        
        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            uploads:    '/api/uploads',
            users:      '/api/users',
        }

        // Conectar db
        this.dbConnect();
        
        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // Sockets
        this.sockets();
    }

    async dbConnect(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
        
        // Directorio Público
        this.app.use(express.static('public'))

        // Fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.users, require('../routes/users'));
    }

    sockets(){
        this.io.on('connection', (socket) =>  socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.PORT, () => {
            console.log('Server running on port', this.PORT);
        });
    }
}

module.exports = Server;