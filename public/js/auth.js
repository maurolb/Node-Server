const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:4000/api/auth/'
            : 'https://maurolb-node-server.herokuapp.com/api/auth/'

miFormulario.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const formData = {};

    for(let elemento of miFormulario.elements){
        if(elemento.name.length > 0){
            formData[elemento.name] = elemento.value
        }

    }
    
    fetch(url + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then( resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            return console.error(msg)
        }
        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch(err => {
        console.log(err)
    })

})

function handleCredentialResponse(response) {
    // Google Token: ID_TOKEN
    // console.log('id_token', response.credential);
    const body = {id_token: response.credential}
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then( resp => resp.json())
    .then( resp => {
        console.log(resp);
        localStorage.setItem('email', resp.user.email)
        localStorage.setItem('token', resp.token)
        window.location = 'chat.html'
    })
    .catch(console.warn)
}
    
const button = document.getElementById('google_signout')
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    })
}