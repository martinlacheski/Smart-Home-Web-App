class Main implements EventListenerObject {

    constructor() {

        // Llamada al evento de cargar todos los dispositivos
        this.getAllDevices();

        let btnNuevo = this.recuperarElemento("btnNuevo");
        btnNuevo.addEventListener('click', () => this.mostrarModal());
        let btnGuardar = this.recuperarElemento("btnGuardar");
        btnGuardar.addEventListener('click', this);
    }

    handleEvent(object: Event): void {
        // Obtener el elemento que se activa
        let elemento = (<HTMLElement>object.target);

        // Verificar el método a realizar

        //Evento Guardar nuevo dispositivo
        if (elemento.id == 'btnGuardar') {
            let type = this.recuperarElemento("select_type");
            let name = this.recuperarElemento("input_name");
            let description = this.recuperarElemento("input_description");
            if (type.value === '' || name.value === '' || description.value === '') {
                alert('Por favor complete los datos del formularios');
            } else {
                alert("type: " + type.value + ", name: " + name.value + ", description: " + description.value);
            }
            // Evento Editar dispositivo
        } else if (elemento.className.includes('editButton')) {
            alert('editar dispositivo');
        }
        // Evento Borrar dispositivo
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
            let input = <HTMLInputElement>object.target;

            if (input.type === "checkbox") {
                /* Se consulta si el tipo de dispositivo es AA y se está encendiendo, 
                como para enviar la temperatura 24º por defecto y cambiar el INPUT a Rango.*/
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

    private recuperarElemento(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id);
    }

    private recuperarButtonDelete(id: string): HTMLButtonElement {
        return <HTMLButtonElement>document.getElementById(id);
    }

    private mostrarModal(): void {
        const modal = this.recuperarElemento("modalNuevo");
        // Mostrar el modal
        modal.style.display = "block";

        // Al hacer clic en el botón "Cerrar" ocultar el modal y limpiar los campos
        const closeButton = modal.querySelector('.modal-close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            let select = document.getElementById('select_type') as HTMLSelectElement;
            select.selectedIndex = 0;
            this.recuperarElemento("input_name").value = "";
            this.recuperarElemento("input_description").value = "";
            modal.style.display = "none";
        });
    }

    // Metodo GET obtener todos los dispositivos
    private getAllDevices(): void {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let ul = this.recuperarElemento("list");
                    let listaDevices: string = '<div class="row">'; // Iniciar fila

                    let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

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
                            default:
                                imgSrc = './static/images/default.png';  // Imagen por defecto si no coincide con ningún tipo
                        }

                        listaDevices += `
                            <div class="col s12 m3 listDevices">  <!-- 3 columnas por fila -->
                                <div class="card">
                                    
                                    <div class="card-content">
                                    <img src="${imgSrc}" width="15%">
                                    <button class="btn-floating btn waves-effect waves-light right red">
                                        <i class="material-icons deleteButton" idBd="${item.id}" id="delete_${item.id}" >delete_forever</i>
                                    </button>
                                    <button id="edit_${item.id}" class="btn-floating btn waves-effect waves-light right orange">
                                        <i class="material-icons editButton">edit</i>
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

                        listaDevices += `              
                                    </div>
                                </div>
                            </div>`;
                    }

                    listaDevices += '</div>'; // Cerrar fila
                    ul.innerHTML = listaDevices;

                    // Agregar eventos a los botones
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
        };

        xmlHttp.open("GET", "http://localhost:8000/device/all", true);
        xmlHttp.send();
    }

    // Metodo PUT actualizar estado dispositivo
    private updateStateDevice(idDevice: number, stateDevice: number): void {

        let messageJSON = { id: idDevice, state: stateDevice };
        let xmlHttpPut = new XMLHttpRequest();
        let responseMetod = "Estado dispositivo id: " + messageJSON.id + " actualizado.";

        xmlHttpPut.open("PUT", "http://localhost:8000/device/state/", true);
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(messageJSON));

        xmlHttpPut.onreadystatechange = () => {
            if (!(xmlHttpPut.status === 204))
                responseMetod = "Error al intentar eliminar el dispositivo";
        }
        alert(responseMetod);
    }


    // Metodo DELETE Eliminar dispositivo
    private deleteDevice(idDevice: number): void {

        let messageJSON = { id: idDevice };
        let xmlHttpPut = new XMLHttpRequest();
        let responseMetod = "Dispositivo id: " + messageJSON.id + " eliminado.";

        xmlHttpPut.open("DELETE", "http://localhost:8000/device/", true);
        xmlHttpPut.setRequestHeader("Content-Type", "application/json");
        xmlHttpPut.send(JSON.stringify(messageJSON));

        xmlHttpPut.onreadystatechange = () => {
            if (!(xmlHttpPut.status === 204)) {
                responseMetod = "Error al intentar eliminar el dispositivo";
            }
        }
        alert(responseMetod);
    }
};




window.addEventListener('load', () => {
    let main: Main = new Main();
});

