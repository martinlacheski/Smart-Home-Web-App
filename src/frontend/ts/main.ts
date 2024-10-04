class Main implements EventListenerObject {
    /*private nombre: string = "martin";
    private users: Array<Usuario> = new Array();

    constructor() {

        this.users.push(new Usuario('martin', '300485'));

        let btn = this.recuperarElemento("btn");
        btn.addEventListener('click', this);
        let btnBuscar = this.recuperarElemento("btnBuscar");
        btnBuscar.addEventListener('click', this);
        let btnLogin = this.recuperarElemento("btnLogin");
        btnLogin.addEventListener('click', this);
        let btnPost = this.recuperarElemento("btnPost");
        btnPost.addEventListener('click', this);
    }*/

    handleEvent(object: Event): void {
        let idDelElemento = (<HTMLElement>object.target).id;
        if (idDelElemento == 'btn') {
            let divLogin = this.recuperarElemento("divLogin");
            divLogin.hidden = false;
        } else if (idDelElemento === 'btnBuscar') {
            console.log("Buscando!")
            this.buscarDevices();
        } else if (idDelElemento === 'btnLogin') {
            console.log("login")
            let iUser = this.recuperarElemento("userName");
            let iPass = this.recuperarElemento("userPass");
            let usuarioNombre: string = iUser.value;
            let usuarioPassword: string = iPass.value;

            if (usuarioNombre.length >= 4 && usuarioPassword.length >= 6) {
                console.log("Voy al servidor... ejecuto consulta")
                let usuario: Usuario = new Usuario(usuarioNombre, usuarioPassword);
                let checkbox = this.recuperarElemento("cbRecor");

                console.log(usuario, checkbox.checked);
                iUser.disabled = true;
                (<HTMLInputElement>object.target).disabled = true;
                let divLogin = this.recuperarElemento("divLogin");
                divLogin.hidden = true;
            } else {
                alert("El usuario o la contraseña son icorrectas");
            }
        } else if (idDelElemento == 'btnPost') {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    console.log("se ejecuto el post", xmlHttp.responseText);
                }
            }

            xmlHttp.open("POST", "http://localhost:8000/usuario", true);

            xmlHttp.setRequestHeader("Content-Type", "application/json");
            xmlHttp.setRequestHeader("otracosa", "algo");


            let json = { name: 'mramos' };
            xmlHttp.send(JSON.stringify(json));


        } else {
            let input = <HTMLInputElement>object.target;
            alert(idDelElemento.substring(3) + ' - ' + input.checked);
            let prenderJson = { id: input.getAttribute("idBd"), status: input.checked }
            let xmlHttpPost = new XMLHttpRequest();

            xmlHttpPost.onreadystatechange = () => {
                if (xmlHttpPost.readyState === 4 && xmlHttpPost.status === 200) {
                    let json = JSON.parse(xmlHttpPost.responseText);
                    alert(json.id);
                }
            }

            xmlHttpPost.open("POST", "http://localhost:8000/device", true);
            xmlHttpPost.setRequestHeader("Content-Type", "application/json")
            xmlHttpPost.send(JSON.stringify(prenderJson));
        }

    }

    private buscarDevices(): void {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let ul = this.recuperarElemento("list")
                    let listaDevices: string = '';

                    let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

                    for (let item of lista) {
                        listaDevices += `
                        <li class="collection-item avatar">
                        <img src="./static/images/lightbulb.png" alt="" class="circle">
                        <span class="title">${item.name}</span>
                        <p>${item.description} 
                        </p>
                        <a href="#!" class="secondary-content">
                          <div class="switch">
                              <label>
                                Off`;
                        if (item.state) {
                            listaDevices += `<input idBd="${item.id}" id="cb_${item.id}" type="checkbox" checked>`
                        } else {
                            listaDevices += `<input idBd="${item.id}"  name="chk" id="cb_${item.id}" type="checkbox">`
                        }
                        listaDevices += `      
                                <span class="lever"></span>
                                On
                              </label>
                            </div>
                      </a>
                      </li>`
                    }
                    ul.innerHTML = listaDevices;

                    for (let item of lista) {
                        let cb = this.recuperarElemento("cb_" + item.id);
                        cb.addEventListener("click", this);
                    }
                } else {
                    alert("ERROR en la consulta");
                }
            }

        }

        xmlHttp.open("GET", "http://localhost:8000/device/all", true);

        xmlHttp.send();

    }

    private buscarDevicesForm(): void {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let container = this.recuperarElemento("deviceContainer");  // Usamos un contenedor diferente

                    // Verificar si el contenedor existe
                    if (container === null) {
                        console.error("El contenedor 'deviceContainer' no fue encontrado en el DOM.");
                        return;
                    }

                    let listaDevices: string = '';
                    let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

                    for (let item of lista) {
                        listaDevices += `
                        <form id="deviceForm_${item.id}">
                            <div>
                                <label>Nombre:</label>
                                <input type="text" id="deviceName_${item.id}" value="${item.name}">
                            </div>
                            <div>
                                <label>Descripción:</label>
                                <input type="text" id="deviceDesc_${item.id}" value="${item.description}">
                            </div>
                            <div>
                                 <div class="switch">
                              <label>
                                Off`;
                        if (item.state) {
                            listaDevices += `<input idBd="${item.id}" id="cb_${item.id}" type="checkbox" checked>`
                        } else {
                            listaDevices += `<input idBd="${item.id}"  name="chk" id="cb_${item.id}" type="checkbox">`
                        }
                        listaDevices += `      
                                <span class="lever"></span>
                                On
                              </label>
                            </div>
                            </div>
                            <button type="button" id="updateDevice_${item.id}" class="update-btn">Actualizar</button>
                            <button type="button" id="deleteDevice_${item.id}" class="delete-btn">Eliminar</button>
                        </form>`;
                    }


                    container.innerHTML = listaDevices;

                    // Agregar eventos a los botones
                    for (let item of lista) {
                        let updateBtn = this.recuperarElemento("updateDevice_" + item.id);
                        let deleteBtn = this.recuperarElemento("deleteDevice_" + item.id);

                        updateBtn.addEventListener("click", () => this.showUpdateModal(item));
                        deleteBtn.addEventListener("click", () => this.deleteDevice(item.id));
                    }
                } else {
                    alert("ERROR en la consulta");
                }
            }
        };

        xmlHttp.open("GET", "http://localhost:8000/device/all", true);
        xmlHttp.send();
    }


    private buscarDevicesForm2(): void {
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    let ul = this.recuperarElemento("list");
                    let listaDevices: string = '<div class="row">'; // Iniciar fila

                    let lista: Array<Device> = JSON.parse(xmlHttp.responseText);

                    for (let item of lista) {
                        
                        let imgSrc = '';  // Variable para almacenar la ruta de la imagen según el tipo de dispositivo

                        // Asignar imagen según el tipo de dispositivo
                        switch (item.type) {
                            case 0:  // Luces ON/OFF
                                imgSrc = './static/images/luz.png';
                                break;
                            case 1:  // Luces dimerizables
                                imgSrc = './static/images/luz_dimerizable.png';
                                break;
                            case 2:  // Persianas (Apertura variable)
                                imgSrc = './static/images/persianas.png';
                                break;
                            case 3:  // Enchufes ON/OFF
                                imgSrc = './static/images/on_off.png';
                                break;
                            case 4:  // Ventiladores (Apertura variable)
                                imgSrc = './static/images/ventilador.png';
                                break;
                            case 5:  // Aire acondicionado (temperatura variable)
                                imgSrc = './static/images/aa.png';
                                break;
                            default:
                                imgSrc = './static/images/default.png';  // Imagen por defecto si no coincide con ningún tipo
                        }

                        listaDevices += `
                            <div class="col s12 m3">  <!-- 3 columnas por fila -->
                                <div class="card" style="min-height: 185px;">
                                    
                                    <div class="card-content">
                                    <img src="${imgSrc}" width="10%">
                                        <p>${item.description}</p>
                                        `;

                        // Si el tipo es 0 (luces ON/OFF) o 3(Enchufe ON/OFF), usar un checkbox
                        if (item.type === 0 || item.type === 3) {
                            listaDevices += `
                            <div class="switch">
                                <label>
                                    Apagado
                                    <input idBd="${item.id}" id="cb_${item.id}" type="checkbox" ${item.state === 1.0 ? 'checked' : ''}>
                                    <span class="lever"></span>
                                    Encendido
                                </label>
                            </div>`;
                        }
                        // Si el tipo es 5 (Aire acondicionado temperatura variable entre 16 y 30), usar un rango (barra deslizante)
                        else if (item.state >= 16 && item.state <= 30) {
                            listaDevices += `
                            <p class="range-field">
                                <input idBd="${item.id}" type="range" id="range_${item.id}" min="16" max="30" step="1" value="${item.state}">
                            </p>`;
                        }
                        // Si el estado es un valor entre 0 y 1, usar un rango (barra deslizante)
                        else if (item.state > 0 && item.state < 1) {
                            listaDevices += `
                            <p class="range-field">
                                <input idBd="${item.id}" type="range" id="range_${item.id}" min="0" max="1" step="0.1" value="${item.state}">
                            </p>`;
                        }
                        listaDevices += `
                                                
                                        <div class="card">
                                        <!-- Botones de actualizar y eliminar -->
                                        <a href="#!" id="updateDevice_${item.id}" class="btn-small col s6">Actualizar</a>
                                        <a href="#!" id="deleteDevice_${item.id}" class="btn-small red col s6">Eliminar</a>
                                    <br />
                                    </div>
                                    </div>
                                </div>
                            </div>`;
                    }

                    listaDevices += '</div>'; // Cerrar fila
                    ul.innerHTML = listaDevices;

                    // Agregar eventos a los botones
                    for (let item of lista) {
                        let cb = this.recuperarElemento("cb_" + item.id);
                        let updateBtn = this.recuperarElemento("updateDevice_" + item.id);
                        let deleteBtn = this.recuperarElemento("deleteDevice_" + item.id);

                        cb.addEventListener("click", this);
                        updateBtn.addEventListener("click", () => this.showUpdateModal(item));
                        deleteBtn.addEventListener("click", () => this.deleteDevice(item.id));
                    }
                } else {
                    alert("ERROR en la consulta");
                }
            }
        };

        xmlHttp.open("GET", "http://localhost:8000/device/all", true);
        xmlHttp.send();
    }




    private recuperarElemento(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id);
    }
}

window.addEventListener('load', () => {

    let main: Main = new Main();

    main.buscarDevicesForm2(); // Llamada directa al método para ejecutarlo al cargar la página

});

