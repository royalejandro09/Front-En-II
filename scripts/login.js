/* -------------------------------------------------------------------------- */
/*                   logica aplicada en la pantalla de LOGIN                  */
/* -------------------------------------------------------------------------- */

const apiUrl = "https://ctd-todo-api.herokuapp.com/v1/users/login";


window.addEventListener('load', function () {

    const formulario = this.document.forms[0];
    const inputEmail = this.document.querySelector('#inputEmail');
    const inputPassword = this.document.querySelector('#inputPassword');

    /************************** */


    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const validacion = validacionNoVacio(inputEmail.value) && validacionNoVacio(inputPassword.value);

        if (validacion) {
            //Si todo es correcto (true) iniciamos la peticion;
            const datosUsuario = normalizacionLogin(inputEmail.value, inputPassword.value);
            console.log(datosUsuario);
            //Consultamso el servidor y esperamos su respuesta 
            fetchApiLogin(apiUrl, datosUsuario);

        } else {
            console.log("Algun dato no es correcto");
        }

        formulario.reset();
    });

});


/****************  SECCION FUNCIONES DISPONIBLES  *************************************** */

function validacionNoVacio(texto) {
    let resultado = (texto === "") ? false : true;
    return resultado;
}

function normalizacionLogin(email, password) {
    const usuario = {
        email: email.toLowerCase().trim(),
        password: password.trim()
    }
    return usuario;
}

/*****************FETCH*************************** */

function fetchApiLogin(url, payload) {

    mostrarSpinner();

    //Configuraciones
    const configuraciones = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'

        },
        body: JSON.stringify(payload)
    }
    // ******* FETCH *******//
    //Fetch funcion nativa que permite hacerle pedidos a una API 
    fetch(url, configuraciones)
        //Devuelve una Promesa -- recibe un Callback y retorna la respuesta de ese llamado asincrono en formato JSON
        .then(response => {
            console.log(response);
            return response.json()
        })
        //Obtenemos los daatos -- Una vez la promesa este en formato JSON podemos utilizar esa respuesta
        .then(data => {
            console.log(data);
            console.log(data.jwt);
            ocultarSpinner();

            //Llegada correcta del Token
            if (data.jwt) {
                localStorage.setItem("Token-Jwt", data.jwt);
                location.href = "/mis-tareas.html"
            }
        })
        .catch(error => console.log(error))


}

function mostrarSpinner() {
    const spinner = document.querySelector('#spinner');
    spinner.style.display = "block";
}

function ocultarSpinner() {
    const spinner = document.querySelector('#spinner');
    spinner.style.display = "none";
}
