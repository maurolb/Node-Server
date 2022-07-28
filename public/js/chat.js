let user = null;
let socket = null;

// Referencias html
const txtUid     = document.querySelector('#txtUid')
const txtMessage = document.querySelector('#txtMessage')
const ulUsers    = document.querySelector('#ulUsers')
const ulMessages = document.querySelector('#ulMessages')
const btnLogout  = document.querySelector('#btnLogout')

const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:4000/api/auth/'
            : 'https://maurolb-node-server.herokuapp.com/api/auth/'

// Validar el token del localstorage
const validateToken = async () => {
    const token = localStorage.getItem('token');

    if(token?.length < 10){
        window.location = 'index.html';
        throw new Error('Non-existent token');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const {user:userDB, token:tokenDB} = await resp.json();
    console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;
    
    await connectSocket();
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    })

    socket.on('receive-messages', dibujarMensajes)

    socket.on('active-users', dibujarUsuarios)

    socket.on('private-message', (payload) => {
        console.log('Privado: ', payload);
    })
}

const dibujarUsuarios = (users = []) => {
    let usersHtml = '';
    users.forEach(({name, uid})=>{
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `
    });

    ulUsers.innerHTML = usersHtml;
}

const dibujarMensajes = (messages = []) => {
    let messageHtml = '';
    messages.forEach(({name, message})=>{
        messageHtml += `
            <li>
                <p>
                    <span class="text-primary">${name}: </span>
                    <span>${message}</span>
                </p>
            </li>
        `
    });

    ulMessages.innerHTML = messageHtml;
}

txtMessage.addEventListener('keypress', ({key}) => {
    const message = txtMessage.value;
    const uid = txtUid.value;

    if(key !== 'Enter'){return}
    if(message.length === 0){return}

    socket.emit('send-message', {message, uid})
    
})

const main  = async () => {
    // Validar JWT
    validateToken()
}

main();