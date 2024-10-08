//Declaración Variable M (para evitar error inicial de Materialize)
var M: any;

class Main implements EventListenerObject {

    constructor() {

        // Ejecutar metodo GET de todos los dispositivos
        this.getAllDevices();

        // Recuperar elementos y agregar evento 'click'
        let btnNuevo = this.recuperarElemento("btnNuevo");
        btnNuevo.addEventListener('click', () => this.mostrarModal());
        let btnGuardar = this.recuperarElemento("btnGuardar");
        btnGuardar.addEventListener('click', this);
    }

    handleEvent(object: Event): void {
        // Obtener el elemento que se activa
        let elemento = (<HTMLElement>object.target);
        /*
         Verificar el método a realizar
        */

        //Evento Crear dispositivo
        if (elemento.id == 'btnGuardar') {

            // Asignar a variables los valores de los campos
            let type = this.recuperarElemento("select_type");
            let name = this.recuperarElemento("input_name");
            let description = this.recuperarElemento("input_description");

            // Verificar que los datos no sean nulos
            if (type.value === '' || name.value === '' || description.value === '') {
                alert('Por favor complete los datos del formularios');
            }

            // Si el evento es para CREAR UN NUEVO DISPOSITIVO
            else if (this.recuperarElemento("btnAction").textContent === 'NEW') {

                // Ejecutar método CREAR Dispositivo
                this.createDevice(name.value, description.value, parseInt(type.value));
                // Ocultar el modal
                this.ocultarModal();
                // Actualizar lista de dispositivos
                this.getAllDevices();
            }

            // Si el evento es para EDITAR UN DISPOSITO
            else if (this.recuperarElemento("btnAction").textContent === 'EDIT') {

                // Recuperar el ID del dispositivo
                let device_id = this.recuperarElemento("device_id");
                // Ejecutar método EDITAR Dispositivo
                this.updateDevice(parseInt(device_id.textContent), name.value, description.value, parseInt(type.value))
                // Ocultar el modal
                this.ocultarModal();
                // Actualizar lista de dispositivos
                this.getAllDevices();
            }
        }

        // Evento Editar Dispositivo
        else if (elemento.className.includes('editButton')) {
            // Obtener el elemento INPUT que se activa
            let input = <HTMLInputElement>object.target;
            // Recuperar el ID del dispositivo
            let deviceID = input.getAttribute("idBd");
            // Ejecutar metodo GET para obtener los datos del dispositivo
            let device = this.getDevice(parseInt(deviceID));
            // Ejecutar método Mostrar el modal
            this.mostrarModal();
        }

        // Evento Eliminar dispositivo
        else if (elemento.className.includes('deleteButton')) {
            if (confirm("¿Estás seguro de eliminar el dispositivo?") == true) {
                // Ejecutar método BORRAR Dispositivo
                this.deleteDevice(parseInt(elemento.getAttribute("idBd")));
                // Actualizar lista de dispositivos
                this.getAllDevices();
            }
        }

        // Evento Actualizar Estado de Dispositivo
        else {
            // Obtener el elemento INPUT que se activa
            let input = <HTMLInputElement>object.target;

            // Verificar tipo de INPUT
            if (input.type === "checkbox") {
                /* Se consulta si el tipo de dispositivo es AA y si se está encendiendo, 
                enviar la temperatura 24º por defecto y cambiar el INPUT a RANGE.*/
                if (parseInt(input.getAttribute("typedevice")) === 6 && input.checked === true) {
                    // Ejecutar método ACTUALIZAR ESTADO Dispositivo
                    this.updateStateDevice(parseInt(input.getAttribute("idBd")), 24);
                    // Actualizar lista de dispositivos
                    this.getAllDevices();
                }
                else {
                    // Ejecutar método ACTUALIZAR ESTADO Dispositivo
                    this.updateStateDevice(parseInt(input.getAttribute("idBd")), Number(input.checked));
                    // Actualizar lista de dispositivos
                    this.getAllDevices();
                }

            } else if (input.type === "range") {

                // Ejecutar método ACTUALIZAR ESTADO Dispositivo
                this.updateStateDevice(parseInt(input.getAttribute("idBd")), Number(input.value));
                // Actualizar lista de dispositivos
                this.getAllDevices();

            } else {
                alert('Método aún no definido');
            }
        }
    }

    // Métodos privados
    private recuperarElemento(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id);
    }

    private recuperarButtonDelete(id: string): HTMLButtonElement {
        return <HTMLButtonElement>document.getElementById(id);
    }

    private ocultarModal(): void {
        // Declarar una constante para interactuar con el MODAL
        const modal = this.recuperarElemento("modalNuevo");

        // Limpiar los campos
        let select = document.getElementById('select_type') as HTMLSelectElement;
        select.selectedIndex = 0;
        this.recuperarElemento("device_id").innerHTML = "";
        this.recuperarElemento("btnAction").innerHTML = "NEW";
        this.recuperarElemento("input_name").value = "";
        this.recuperarElemento("input_description").value = "";

        // Cerrar modal
        var instance = M.Modal.init(modal);
        instance.close();
    }

    private mostrarModal(): void {
        // Mostrar el modal
        var modal = this.recuperarElemento("modalNuevo");
        var instance = M.Modal.init(modal);
        instance.open();

        // Al hacer clic en el botón "Cerrar" ocultar el modal
        const closeButton = modal.querySelector('.modal-close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            this.ocultarModal();
        });
    }

    // Metodo GET obtener todos los dispositivos
    private getAllDevices(): void {

        // Variable para realizar la petición
        let xmlHttp = new XMLHttpRequest();        

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let ul = this.recuperarElemento("list");
                    let listaDevices: string = '<div class="row">'; // Iniciar fila

                    // Obtener el ARRAY de dispositivos
                    let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

                    // Iterar el ARRAY para cargar los dispositivos en la página
                    for (let item of lista) {

                        // Variable para almacenar la ruta de la imagen segun el tipo de dispositivo
                        let imgSrc = '';

                        // Asignar imagen segun el tipo de dispositivo
                        switch (item.type) {
                            case 1:  // Luces ON/OFF
                                imgSrc = './static/images/luz.png';
                                break;
                            case 2:  // Luces dimerizables
                                imgSrc = './static/images/luz_dimerizable.png';
                                break;
                            case 3:  // Persianas (Apertura variable)
                                imgSrc = './static/images/persianas.png';
                                break;
                            case 4:  // Enchufes ON/OFF
                                imgSrc = './static/images/on_off.png';
                                break;
                            case 5:  // Ventiladores (Apertura variable)
                                imgSrc = './static/images/ventilador.png';
                                break;
                            case 6:  // Aire acondicionado (temperatura variable)
                                imgSrc = './static/images/aa_1.png';
                                break;
                            // Imagen por defecto si no coincide con ningún tipo
                            default:
                                imgSrc = './static/images/default.png';
                        }

                        /* 
                            Cargar la imagen correspondiente
                            Crear botonos de EDIT y DELETE por cada Dispositivo, y con el ID correspondiente
                            Colocar los campos "name" y "description"
                        */
                        listaDevices += `
                            <div class="col m3 listDevices">  <!-- 3 columnas por fila -->
                                <div class="card">
                                    
                                    <div class="card-content">
                                    <img src="${imgSrc}" width="15%">
                                    <button class="btn-floating btn waves-effect waves-light right red">
                                        <i class="material-icons deleteButton" idBd="${item.id}" id="delete_${item.id}" >delete_forever</i>
                                    </button>
                                    <button id="edit_${item.id}" class="btn-floating btn waves-effect waves-light right orange">
                                        <i class="material-icons editButton" idBd="${item.id}">edit</i>
                                    </button>
                                    
                                    
                                    <p>${item.name}</p>    
                                    <p>${item.description}</p>                                       
                                        `;

                        // Si el tipo es 0 (luces ON/OFF) o 3(Enchufe ON/OFF), usar un checkbox
                        if (item.type === 1 || item.type === 4) {
                            listaDevices += `
                            <div class="switch" style="height: 30px">
                            <label>
                                    Off
                                    <input idBd="${item.id}" typedevice="${item.type}" id="device_${item.id}" type="checkbox" ${item.state === 1.0 ? 'checked' : ''}>
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>`;
                        }

                        // Si el tipo es 2 (Luces dimerizables), 3 (Persianas), 5 (Ventiladores), usar un rango (barra deslizante)
                        else if (item.type === 2 || item.type === 3 || item.type === 5 && item.state >= 0 && item.state <= 1) {
                            listaDevices += `
                            <div class="range-field" style="height: 30px">
                                <input idBd="${item.id}" typedevice="${item.type}" type="range" id="device_${item.id}" deleteDevice min="0.0" max="1.0" step="0.1" value="${item.state}">
                            </div>`;
                        }

                        // Si el tipo es 6 (Aire acondicionado temperatura variable pero está apagado), usar un checkbox
                        else if (item.type === 6 && item.state < 16.0) {
                            listaDevices += `
                            <div class="switch" style="height: 30px">
                                <label>
                                    Off
                                    <input idBd="${item.id}" typedevice="${item.type}" id="device_${item.id}" type="checkbox">
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>`;
                        }

                        // Si el tipo es 6 (Aire acondicionado temperatura variable entre 16 y 30), usar un rango (barra deslizante)
                        else if (item.type === 6 && item.state >= 16.0 && item.state <= 30.0) {
                            listaDevices += `
                            <div class="range-field" style="height: 30px">
                                <input idBd="${item.id}" typeDevice="${item.type}" type="range" id="device_${item.id}" min="15" max="30" step="1" value="${item.state}">
                            </div>`;
                        }

                        // Cerrar fila
                        listaDevices += `              
                                    </div>
                                </div>
                            </div>`;
                    }
                    // Cerrar Lista de Dispositivos
                    listaDevices += '</div>';

                    // Insertar la lista de dispositivos en el HTML
                    ul.innerHTML = listaDevices;

                    // Por cada Dispositivo de la lista, Agregar los eventos a los botones
                    for (let item of lista) {
                        let state = this.recuperarElemento("device_" + item.id);
                        let editBtn = this.recuperarButtonDelete("edit_" + item.id);
                        let deleteBtn = this.recuperarButtonDelete("delete_" + item.id);
                        state.addEventListener("click", this);
                        editBtn.addEventListener("click", this);
                        deleteBtn.addEventListener("click", this);
                    }
                } else {
                    alert("ERROR en la consulta");
                }
            }
        }
        
        // Se realiza la petición
        xmlHttp.open("GET", "http://localhost:8000/device/", true);
        xmlHttp.send();

    }

    // Metodo GET obtener dispositivo
    private getDevice(idDevice: number): any {

        // Variable para realizar la petición
        let xmlHttpGet = new XMLHttpRequest();

        // Se establece la ruta incorporando el ID del dispositivo
        let url = "http://localhost:8000/device/";
        url += idDevice;

        // Se realiza la petición
        xmlHttpGet.open("GET", url, true);
        xmlHttpGet.send();

        // Se analiza el cambio de estado
        xmlHttpGet.onreadystatechange = () => {
            if (xmlHttpGet.readyState == 4) {
                //Se devuelve el error
                if (!(xmlHttpGet.status === 200)) {
                    M.toast({ html: 'Error al intentar obtener el dispositivo', classes: 'rounded waves-effect waves-light red' });
                }
                // Si no hay error se cargan los datos obtenidos del dispositivo a los elementos del modal
                else {
                    let lista = JSON.parse(xmlHttpGet.responseText);
                    let select = document.getElementById('select_type') as HTMLSelectElement;
                    select.selectedIndex = lista[0].type;
                    this.recuperarElemento("device_id").innerHTML = lista[0].id;
                    this.recuperarElemento("btnAction").innerHTML = "EDIT";
                    this.recuperarElemento("input_name").value = lista[0].name;
                    this.recuperarElemento("input_description").value = lista[0].description;
                }
            }
        }
    }

    // Metodo POST crear dispositivo
    private createDevice(nameDevice: string, descriptionDevice: string, typeDevice: number): void {

        // Variable para armar el mensaje en formato JSON
        let messageJSON = { name: nameDevice, description: descriptionDevice, type: typeDevice, state: 0 };

        // Variable para realizar la petición
        let xmlHttpPost = new XMLHttpRequest();

        // Variable para el texto de respuesta
        let responseMetod = { html: 'Se ha creado el dispositivo', classes: 'rounded waves-effect waves-light green' };

        // Se realiza la petición
        xmlHttpPost.open("POST", "http://localhost:8000/device/", true);
        xmlHttpPost.setRequestHeader("Content-Type", "application/json");
        xmlHttpPost.send(JSON.stringify(messageJSON));

        // Se analiza el cambio de estado (Si tiene error se devuelve el mensaje de error)
        xmlHttpPost.onreadystatechange = () => {
            if (!(xmlHttpPost.status === 204)) {
                responseMetod = { html: 'Error al intentar crear el dispositivo', classes: 'rounded waves-effect waves-light red' };
            }
        }

        // Se ejecuta el TOAST con la respuesta
        M.toast(responseMetod);
    }

    // Metodo PUT Actualizar Estado Dispositivo
    private updateStateDevice(idDevice: number, stateDevice: number): void {

        // Variable para armar el mensaje en formato JSON
        let messageJSON = { id: idDevice, state: stateDevice };

        // Variable para realizar la petición
        let xmlHttpPut = new XMLHttpRequest();

        // Variable para el texto de respuesta
        let responseMetod = { html: 'Se ha actualizado el estado del dispositivo', classes: 'rounded waves-effect waves-light green' };

        // Se realiza la petición
        xmlHttpPut.open("PUT", "http://localhost:8000/device/state/", true);
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(messageJSON));

        // Se analiza el cambio de estado (Si tiene error se devuelve el mensaje de error)
        xmlHttpPut.onreadystatechange = () => {
            if (!(xmlHttpPut.status === 204)) {
                responseMetod = { html: 'Error al intentar actualizar el estado del dispositivo', classes: 'rounded waves-effect waves-light red' };
            }
        }

        // Se ejecuta el TOAST con la respuesta
        M.toast(responseMetod);
    }

    // Metodo PUT Actualizar Dispositivo
    private updateDevice(idDevice: number, nameDevice: string, descriptionDevice: string, typeDevice: number): void {

        // Variable para armar el mensaje en formato JSON
        let messageJSON = { id: idDevice, name: nameDevice, description: descriptionDevice, type: typeDevice };

        // Variable para realizar la petición
        let xmlHttpPut = new XMLHttpRequest();

        // Variable para el texto de respuesta
        let responseMetod = { html: 'Se ha actualizado el dispositivo', classes: 'rounded waves-effect waves-light green' };

        // Se realiza la petición
        xmlHttpPut.open("PUT", "http://localhost:8000/device/", true);
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(messageJSON));

        // Se analiza el cambio de estado (Si tiene error se devuelve el mensaje de error)
        xmlHttpPut.onreadystatechange = () => {
            if (!(xmlHttpPut.status === 204)) {
                responseMetod = { html: 'Error al intentar actualizar el dispositivo', classes: 'rounded waves-effect waves-light red' };
            }
        }

        // Se ejecuta el TOAST con la respuesta
        M.toast(responseMetod);
    }

    // Metodo DELETE Eliminar dispositivo
    private deleteDevice(idDevice: number): void {

        // Variable para armar el mensaje en formato JSON
        let messageJSON = { id: idDevice };

        // Variable para realizar la petición
        let xmlHttpPut = new XMLHttpRequest();

        // Variable para el texto de respuesta
        let responseMetod = { html: 'Se ha eliminado correctamente el dispositivo', classes: 'rounded waves-effect waves-light green' };

        // Se realiza la petición
        xmlHttpPut.open("DELETE", "http://localhost:8000/device/", true);
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(messageJSON));

        // Se analiza el cambio de estado (Si tiene error se devuelve el mensaje de error)
        xmlHttpPut.onreadystatechange = () => {
            if (!(xmlHttpPut.status === 204)) {
                responseMetod = { html: 'Error al intentar eliminar el dispositivo', classes: 'rounded waves-effect waves-light red' };
            }
        }

        // Se ejecuta el TOAST con la respuesta
        M.toast(responseMetod);
    }
};

window.addEventListener('load', () => {
    // Variable para instanciar la clase MAIN
    let main: Main = new Main();
});

