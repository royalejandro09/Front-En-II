
//Obteniendo el Token de mi usuario almacenado en el LocalStorage
//Chequeo la exixstencia del usuario loggeado  si no existe redirigirlo al Loguin 
const jwt = localStorage.getItem('Token-Jwt');
if (!jwt) {
    alert("Debe realizar el login con su usuario y contraseña")
    location.replace('/');
}

const apiBaseUrl = 'https://ctd-todo-api.herokuapp.com/v1';

/********************** EVENTOS ********************************************* */
window.addEventListener('load', function () {

    //Capturando etiquetas
    const nodoNombreUsuario = document.querySelector('.user-info p');
    const nodoFormulario = document.querySelector('.nueva-tarea');
    const inputNuevaTarea = document.querySelector('#nuevaTarea');

    /********** EJECUCION ***************** */
    obtenerNombreUsuario(`${apiBaseUrl}/users/getMe`, jwt);
    obtenerListadoTareas(`${apiBaseUrl}/tasks`, jwt);

    //Cerrar Sesion
    botonCerrar = document.querySelector('#closeApp');

    botonCerrar.addEventListener('click', function () {
        //limpiamos el storage donde tenemos almacenado el Token 
        if (confirm("Desea cerrar su sesion?")) {
            localStorage.clear();
            location.replace("/");
        }

    })

    //Utilizando el evento Submit para crear Tareas
    nodoFormulario.addEventListener('submit', function (e) {
        e.preventDefault();

        //Creando la tarea 
        const nuevaTarea = {
            description: inputNuevaTarea.value,
            completed: false
        };
        crearNuevaTarea(`${apiBaseUrl}/tasks`, jwt, nuevaTarea);

        nodoFormulario.reset();
    })


    /************** FUNCIONALIDADES ******************************* */

    function obtenerNombreUsuario(url, jwt) {
        const settings = {
            method: 'GET',
            headers: {
                authorization: jwt
            }
        }
        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                nodoNombreUsuario.innerHTML = data.firstName;
            })
    }

    //Declaramos nuestra funcioon asincrona ASYNC para utilizar el await (async/await)
    async function obtenerListadoTareas(url, jwt) {

        const settings = {
            method: 'GET',
            headers: {
                authorization: jwt
            }

        }

        try {
            //Con el await esperamos el resultado de la promesa y lo almacenamos en respuesta
            const respuesta = await fetch(url, settings);
            //Este respuesta.json() me devuelve otra promesa utilizamos el await
            const data = await respuesta.json();
            console.log(data);
            renderizarTareas(data);

        } catch (error) {
            console.log(error);
            alert(error);
        }


        /**fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                renderizarTareas(data);
           })**/
    }

    function crearNuevaTarea(url, token, payload) {

        const settings = {
            method: 'POST',
            headers: {
                authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }

        fetch(url, settings)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                obtenerListadoTareas(`${apiBaseUrl}/tasks`, token);
            })
    }

    function renderizarTareas(listadoDeTareas) {

        const nodoTareasPendientes = document.querySelector(".tareas-pendientes");
        const nodoTareasTerminadas = document.querySelector(".tareas-terminadas");

        //Inicializamos los nodos de las tareas en vacio para que al ejecutar la funcion me cargue toda la lista con las nuevas tareas creadas
        nodoTareasTerminadas.innerHTML = "";
        nodoTareasPendientes.innerHTML = "";


        const tareasTerminadas = listadoDeTareas.filter(tarea => tarea.completed);
        const tareasPendientes = listadoDeTareas.filter(tarea => !tarea.completed);

        nodoTareasTerminadas.innerHTML = tareasTerminadas.map(tarea =>
            `<li class="tarea">
            <div class="done"></div>
            <div class="descripcion">
               <p class="nombre">${tarea.description}</p>
               <div>
                   <button><i id="${tarea.id}" class="fas fa-undo-alt change"></i></button>
                   <button><i id="${tarea.id}" class="far fa-trash-alt"></i></button>
                </div>
            </div>
            </li>` ).join('')

        nodoTareasPendientes.innerHTML = tareasPendientes.map(tarea =>
            `<li class="tarea">
                     <div class="not-done change" id="${tarea.id}"></div>
                     <div class="descripcion">
                          <p class="nombre">${tarea.description}</p>
                          <p class="timestamp"><i class="far fa-calendar-alt"></i> ${tarea.createdAt}</p>
                     </div>
          </li>` ).join('')

        /**listadoDeTareas.forEach(tarea => {
            if (!tarea.completed) {
                nodoTareasPendientes.innerHTML +=
                    `<li class="tarea">
                     <div class="not-done change" id="${tarea.id}"></div>
                     <div class="descripcion">
                          <p class="nombre">${tarea.description}</p>
                        <p class="timestamp"><i class="far fa-calendar-alt"></i> ${tarea.createdAt}</p>
                     </div>
            </li>`
            } else {
                nodoTareasTerminadas.innerHTML +=
                    `<li class="tarea">
                     <div class="done"></div>
                     <div class="descripcion">
                        <p class="nombre">${tarea.description}</p>
                        <div>
                            <button><i id="${tarea.id}" class="fas fa-undo-alt change"></i></button>
                            <button><i id="${tarea.id}" class="far fa-trash-alt"></i></button>
                         </div>
                     </div>
            </li>`
            }
        });**/

        cambioDeEstado();
        borrarTarea();

    }

    function cambioDeEstado() {
        const btnCambioEstado = document.querySelectorAll('.change');

        btnCambioEstado.forEach(boton => {
            boton.addEventListener('click', function (e) {

                //e.target : me captura el id del elemento donde ejecuto el evento click
                const id = e.target.id;
                const url = `${apiBaseUrl}/tasks/${id}`;
                const payload = {};

                if (e.target.classList.contains('fa-undo-alt')) {
                    payload.completed = false;
                } else {
                    payload.completed = true;
                }

                const settingsCambio = {
                    method: 'PUT',
                    headers: {
                        'Authorization': jwt,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
                fetch(url, settingsCambio)
                    .then(response => {
                        console.log(response.status);
                        return response.json();
                        //obtenerListadoTareas(`${apiBaseUrl}/tasks`, jwt);
                    })
                    .then(data => {
                        console.log(data);
                        obtenerListadoTareas(`${apiBaseUrl}/tasks`, jwt);
                    })
            })
        })
    }

    function borrarTarea() {
        const btnBorrarTarea = document.querySelectorAll('.fa-trash-alt');

        btnBorrarTarea.forEach(boton => {
            boton.addEventListener('click', function (e) {

                const id = e.target.id;
                const url = `${apiBaseUrl}/tasks/${id}`

                const settingsCambio = {
                    method: 'DELETE',
                    headers: {
                        'Authorization': jwt,
                    }
                }

                fetch(url, settingsCambio)
                    .then(response => {
                        console.log(response.status);
                        return response.json();
                        //obtenerListadoTareas(`${apiBaseUrl}/tasks`, jwt);
                    })
                    .then(data => {
                        console.log(data);
                        obtenerListadoTareas(`${apiBaseUrl}/tasks`, jwt);
                    })

            })
        });
    }


})
