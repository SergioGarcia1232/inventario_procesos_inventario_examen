//funciones propias de la app
//const urlApis = "http://localhost:8082/vehiculo";
const urlApi = "http://localhost:8082";//colocar la url con el puerto

async function login(){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi+"/auth/login",settings);
    //console.log(await request.text());
    if(request.ok){
        const respuesta = await request.json();
        localStorage.token = respuesta.data.token;

        //localStorage.token = respuesta;
        localStorage.email = jsonData.email;      
        location.href= "dashboard.html";
    }
}
function listar_Vehiculo() {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    };
    
    fetch(urlApi + "/vehiculo", settings,{ mode: 'no-cors' })
        .then(response => response.json())
        .then(function(vehiculos) {
            //var vehiculos = data;
            var vehiculosHtml = '';
            
            for (const vehiculo of vehiculos) {
                vehiculosHtml += `
                    <tr>
                        <th scope="row">${vehiculo.id}</th>
                        <td>${vehiculo.car}</td>
                        <td>${vehiculo.car_model}</td>
                        <td>${vehiculo.car_color}</td>
                        <td>${vehiculo.car_model_year}</td>
                        <td>${vehiculo.car_vin}</td>
                        <td>${vehiculo.price}</td>
                        <td>${vehiculo.availability}</td>
                        <td>${vehiculo.user.id}</td>
                        <td>
                            <button type="button" class="btn btn-outline-danger" onclick="eliminaVehiculo('${vehiculo.id}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarVehiculo('${vehiculo.id}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            <a href="#" onclick="verVehiculos('${vehiculo.id}')" class="btn btn-outline-info">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                        </td>
                    </tr>`;
            }
            
            var listarVehiculoElement = document.getElementById("listar_Vehiculo");
            if (listarVehiculoElement) {
                listarVehiculoElement.innerHTML = vehiculosHtml;
            } else {
                console.error("Elemento 'listar_Vehiculo' no encontrado.");
            }
        })
        .catch(function(error) {
            console.error("Error al obtener los vehículos:", error);
        });
}
function verVehiculos(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/vehiculo/"+id,settings)
    .then(response => response.json())
    .then(function(response){
            var cadena='';
            var vehiculo=response;
            if(vehiculo){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Car: ${vehiculo.car}</li>
                    <li class="list-group-item">car_model: ${vehiculo.car_model}</li>
                    <li class="list-group-item">car_color: ${vehiculo.car_color}</li>
                    <li class="list-group-item">car_model_year: ${vehiculo.car_model_year}</li>
                    <li class="list-group-item">car_vin: ${vehiculo.car_vin}</li>
                    <li class="list-group-item">price: ${vehiculo.price}</li>
                    <li class="list-group-item">availability: ${vehiculo.availability}</li>
                    <li class="list-group-item">user: ${vehiculo.user.id}</li>
                </ul>`;
              
            }
            document.getElementById("contentModalm").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalVehiculo'))
            myModal.toggle();
    })
}

function verModificarVehiculo(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/vehiculo/"+id,settings)
    .then(response => response.json())
    .then(function(response){
            var cadena='';
            var vehiculo = response;
            if(vehiculo){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Vehiculo</h1>
                </div>
              
                <form action="" method="post" id="modificar1">
                    <input type="hidden" name="id" id="id" value="${vehiculo.id}">
                    
                    <label for="car" class="form-label">car</label>
                    <input type="text" class="form-control" name="car" id="car" required value="${vehiculo.car}"> <br>
                    
                    <label for="car_model" class="form-label">car_model</label>
                    <input type="text" class="form-control" name="car_model" id="car_model" required value="${vehiculo.car_model}"> <br>

                    <label for="car_color" class="form-label">car_color</label>
                    <input type="text" class="form-control" name="car_color" id="car_color" required value="${vehiculo.car_color}"> <br>

                    <label for="car_model_year" class="form-label">car_model_year</label>
                    <input type="text" class="form-control" name="car_model_year" id="car_model_year" required value="${vehiculo.car_model_year}"> <br>

                    <label for="price"  class="form-label">price</label>
                    <input type="text" class="form-control" name="price" id="price" required value="${vehiculo.price}"> <br>

                    <label for="availability" class="form-label">availability</label>
                    <select name="availability" class="form-control" id="availability">
                        <option value="true" ${vehiculo.availability ? 'selected' : ''}>True</option>
                        <option value="false" ${!vehiculo.availability ? 'selected' : ''}>False</option>
                    </select> <br>

                    <button type="button" class="btn btn-outline-warning" onclick="modificarVehiculo('${vehiculo.id}')">Modificar</button>
                </form>`;
            }
            document.getElementById("contentModalm").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalVehiculo'))
            myModal.toggle();
    })
}
async function modificarVehiculo(id) {
    validaToken();
    var myForm = document.getElementById("modificar1");
    var formData = new FormData(myForm);
    formData.append("car", document.getElementById("car").value); // Agrega el campo "car" al objeto FormData
    
    var jsonData = {};
    for (var [k, v] of formData) {
        jsonData[k] = v;
    }
    console.log(jsonData);

    const request = await fetch(urlApi + "/vehiculo/" + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });

    listar_Vehiculo();
    alertas("Se ha modificado el vehiculo exitosamente!", 1);
    document.getElementById("contentModalm").innerHTML = '';
    var myModalE2 = document.getElementById('modalVehiculo');
    var modal = bootstrap.Modal.getInstance(myModalE2);
    modal.hide();
}
/*async function modificarVehiculo(id){
    validaToken();
    var myForm = document.getElementById("modificar1");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/vehiculo/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listar_Vehiculo();
    alertas("Se ha modificado el vehiculo exitosamente!",1)
    document.getElementById("contentModalm").innerHTML = '';
    var myModalE2 = document.getElementById('modalVehiculo')
    var modal = bootstrap.Modal.getInstance(myModalE2) // Returns a Bootstrap modal instance
    modal.hide();
}
*/


function registerFormVehiculo(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> User Register</h1>
            </div>
              
            <form action="" method="post" id="registerFormVehiculo">
                <input type="hidden" name="id" id="id">
                <label for="firstName" class="form-label">First Name</label>
                <input type="text" class="form-control" name="firstName" id="firstName" required> <br>
                <label for="lastName"  class="form-label">Last Name</label>
                <input type="text" class="form-control" name="lastName" id="lastName" required> <br>
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" name="email" id="email" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarVehiculos()">Registrar</button>
            </form>`;
            document.getElementById("contentModalm").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalVehiculos'))
            myModal.toggle();
}

async function registrarVehiculos(){
    var myForm = document.getElementById("registerFormVehiculo");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/vehiculo", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    listar();
    alertas("Se ha registrado el vehiculo exitosamente!",1)
    document.getElementById("contentModalm").innerHTML = '';
    var myModalEl = document.getElementById('modalVehiculo')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}


function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}
function validaToken(){
    if(localStorage.token == undefined){
        salir();
    }
}
function alertas(mensaje,tipo){
    var color ="";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("datos").innerHTML = alerta;
}

function salir(){
    localStorage.clear();
    location.href = "index.html";
}