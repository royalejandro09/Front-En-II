

const addUser="https://ctd-todo-api.herokuapp.com/v1/users";

window.addEventListener("load", function(){
    

    const registrarse=this.document.forms[0];
    const nombre=this.document.querySelector("#inputNombre");
    const apellido=this.document.querySelector("#inputApellido");
    const email=this.document.querySelector("#inputEmail");
    const contrasenia=this.document.querySelector("#inputPassword");
    const contraseniaRepetida=this.document.querySelector("#inputPassword2");

    /************************************** */

    registrarse.addEventListener("submit",function(e){
        e.preventDefault();

        const validacion = validarNoVacio(nombre.value) && validarNoVacio(apellido.value) && validarNoVacio(email.value) && validarNoVacio(contrasenia.value) && validacionContrasenias(contrasenia.value, contraseniaRepetida.value); 
        
        if(validacion){

        let datosUser = normalizacionRegistro(nombre.value, apellido.value, email.value, contrasenia.value);
        console.log(datosUser);

        //Consultamos al servidor y esperamos su respuesta 
        fetchAddUser(addUser, datosUser);
        
        }else{
            console.log("Alguno de los datos no es correcto");
        }

        registrarse.reset();
        
    })

});

/****************  SECCION FUNCIONES  ************************************* */


function validarNoVacio(texto){
let resultado = (texto == true) ? false : true;
return resultado;
}

function validacionContrasenias(contrasenia1, contrasenia2){
let resultado = (contrasenia1 !== contrasenia2)? false : true;
return resultado;
}

function normalizacionRegistro(name, lastName, email, password){
    const usuario={
        firstName:name.trim(),
        lastName:lastName.trim(),
        email:email.toLowerCase().trim(),
        password:password.trim()
    }
    return usuario;
}

/************************************************* */


//Fetch para envio de datos al servidor para registro de usuario
function fetchAddUser(url, payload){

    const settings ={
    method:'POST',
    headers:{
            'Content-Type':'application/json'
     },
     body:JSON.stringify(payload)
    }

    fetch(url, settings)
    .then(response =>  {
        console.log(response);
         return response.json()
    })

    .then(data => {
     console.log(data);
     console.log(data.jwt);

     if(data.jwt){
         localStorage.setItem('jwt', data.jwt);

         location.href = '/mis-tareas.html'
     }
     
    })

}