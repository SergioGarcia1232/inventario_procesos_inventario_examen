//funciones propias de la app
//const urlApis = "http://localhost:8082/vehiculo";

const urlApi = "http://localhost:8088";//colocar la url con el puerto

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

async function user() {
    validaToken();
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    const request = await fetch(urlApi + "/user", settings)
        .then(response => response.json())
        .then(function (users) {
            usuarios=users.data
            console.log(usuarios[0])
            var select = document.getElementById("user");

            for(var i = 0; i < usuarios.length; i++) {
                var opcion = document.createElement("option");
                opcion.text = usuarios[i].id;
                select.add(opcion);

            }

        })
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
                            <button type="button" class="btn btn-outline-danger" onclick="eliminarVehiculo('${vehiculo.id}')">
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
                    <h1 class="display-5"><i class="fa-solid fa-truck-moving"></i> Modificar Vehiculo</h1>
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


function registerFormVehiculo() {
    user();
    var cadena = `
        <div class="p-3 mb-2 bg-light text-dark">
            <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Vehiculo Register</h1>
        </div>
        
        <form action="" method="post" id="registerFormVehiculo">
            <label for="id" class="form-label">Id</label>
            <input type="text" class="form-control" name="id" id="id" required> <br>

            <label for="car" class="form-label">Car</label>
            <input type="text" class="form-control" name="car" id="car" required> <br>

            <label for="car_model" class="form-label">Car Model</label>
            <input type="text" class="form-control" name="car_model" id="car_model" required> <br>

            <label for="car_color" class="form-label">Car Color</label>
            <input type="text" class="form-control" name="car_color" id="car_color" required> <br>

            <label for="car_model_year" class="form-label">Car Model Year</label>
            <input type="text" class="form-control" name="car_model_year" id="car_model_year" required> <br>

            <label for="car_vin" class="form-label">Car VIN</label>
            <input type="text" class="form-control" name="car_vin" id="car_vin" required> <br>

            <label for="price" class="form-label">Price</label>
            <input type="text" class="form-control" name="price" id="price" required> <br>

            <label for="availability" class="form-label">Availability</label>
            <select name="availability" class="form-control" id="availability" required>
                <option value="true">True</option>
                <option value="false">False</option>
            </select> <br>

            <label for="user" class="form-label">Register user</label>
            <select class="form-control" id="user" name="user" required>
                   
            </select>

            <button type="button" class="btn btn-outline-info" onclick="registrarVehiculo()">Registrar</button>
        </form>`;

    document.getElementById("contentModalm").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById('modalVehiculo'));
    myModal.toggle();
}

async function registrarVehiculo() {
    validaToken();
    var myForm = document.getElementById("registerFormVehiculo");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        if (k == "user") {
            jsonData[k] = { id: v };
        } else {
            jsonData[k] = v;
        }
    }
    jsonData=jsonData;
    const request = await fetch(urlApi + "/vehiculo", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listar_Vehiculo();
    alertas("Se ha registrado el vehiculo exitosamente!", 1);
    document.getElementById("contentModalm").innerHTML = '';
    var myModalEl = document.getElementById('modalVehiculo');
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
}

function eliminarVehiculo(id) {
    validaToken();
  
    // Muestra la confirmación con SweetAlert
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el vehiculo de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        var settings = {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
          },
        };
  
        fetch(urlApi + "/vehiculo/" + id, settings,{ mode: 'no-cors' })
          .then(response => response.json())
          .then(function (data) {
            listar_Vehiculo();
            alertas("Se ha eliminado El vehiculo exitosamente!", 2);
          });
      }
    });
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