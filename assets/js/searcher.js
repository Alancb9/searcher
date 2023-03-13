let loadProducts = async () => {

    try {

        let jsonUrl = 'https://raw.githubusercontent.com/Bootcamp-Espol/Datos/main/products.json';
        let xmlUrl = 'https://raw.githubusercontent.com/Bootcamp-Espol/Datos/main/products.xml';

        let [jsonResponse, xmlResponse] = await Promise.all([fetch(jsonUrl), fetch(xmlUrl)]);

        let datosJson = await jsonResponse.json();
        let datosXml = await xmlResponse.text();

        // Procesamiento del XML
        let documentoXml = (new DOMParser).parseFromString(datosXml, 'application/xml');
        let datosProductosXml = new Array();

        Array.from(documentoXml.getElementsByTagName('product')).forEach((elementoProducto) => {

            let nombre = elementoProducto.getElementsByTagName('name')[0].textContent;
            let precio = elementoProducto.getElementsByTagName('price')[0].textContent;
            let fuente = elementoProducto.getElementsByTagName('src')[0].textContent;
            let tipo = elementoProducto.getElementsByTagName('type')[0].textContent;

            datosProductosXml.push({ "name": nombre, "price": precio, "src": fuente, "type": tipo })

        });

        return [datosJson, datosProductosXml];

    } catch (error) {

        console.error(error);
        return [];

    };

};

let recorrerDatos = (menu) => {

    let listaPlatos = document.getElementById("seccionPlatos");

    for (let datosComida of menu) {

        let nuevoPlato = document.createElement("div");
        nuevoPlato.classList.add("col-xl-3", "col-md-6", "mb-xl-0", "mb-4", "mt-4");
        nuevoPlato.innerHTML = `<div class="card card-blog card-plain">
                                    <div class="card-header p-0 mt-n4 mx-3">
                                        <a class="d-block shadow-xl border-radius-xl">
                                            <img src="${datosComida["src"]}" alt="${datosComida["name"]}" class="img-fluid shadow border-radius-xl">
                                        </a>
                                    </div>
                                    <div class="card-body p-3">
                                        <p class="mb-0 text-sm">${datosComida["type"]}</p>
                                        <a href="javascript:;">
                                            <h5>
                                            ${datosComida["name"]}
                                            </h5>
                                        </a>
                                        <p class="mb-4 text-sm">
                                            <b>Price: </b> $ ${datosComida["price"]}
                                        </p>
                                    </div>
                                </div>`;

        listaPlatos.appendChild(nuevoPlato);


    };

};

// cargar datos en la plantilla de manera asincrona
let cargarDatosPlantilla = async () => {

    try {

        let datos = await loadProducts();

        for (let item of datos) {

            recorrerDatos(item);

        };



    } catch (error) {

        console.error(error);

    };

};

//Buscar contenido verificando algunas posibilidades que pueda realizar el usuario como el enter y el click
let buscarContenido = () => {

    let boton = document.getElementById("filter");
    let input = document.getElementById("text");

    let buscar = () => {

        let buscarTexto = document.getElementById("text").value.toLowerCase().trim();
        let productos = document.querySelectorAll(".col-xl-3.col-md-6.mb-xl-0.mb-4.mt-4 .card.card-blog.card-plain");

        let nuevoContenedor = document.getElementById("seccionPlatos");
        nuevoContenedor.innerHTML = "";

        let resultadosEncontrados = false;

        if (productos.length !== 12){

            let cargardatos2 = async () => {

                try {
                    
                    await cargarDatosPlantilla();

                    let productos = document.querySelectorAll(".col-xl-3.col-md-6.mb-xl-0.mb-4.mt-4 .card.card-blog.card-plain");

                    let nuevoContenedor = document.getElementById("seccionPlatos");
                    nuevoContenedor.innerHTML = "";
                    // let resultadosEncontrados = false;

                    if (buscarTexto === "") {
                        productos.forEach((producto) => {
                            let productoNuevo = document.createElement("div");
                            productoNuevo.innerHTML = producto.innerHTML;
                            productoNuevo.classList.add("col-xl-3", "col-md-6", "mb-xl-0", "mb-4", "mt-4");
                            nuevoContenedor.appendChild(productoNuevo);
                        });
                    } else {
                        productos.forEach((producto) => {
            
                            let nombre = producto.querySelector("h5").textContent.toLowerCase().trim();
                            let tipo = producto.querySelector("p.text-sm").textContent.toLowerCase().trim();
                            
                            if (nombre.includes(buscarTexto) || tipo.includes(buscarTexto)) {
                                let productoNuevo = document.createElement("div");
                                productoNuevo.innerHTML = producto.innerHTML;
                                productoNuevo.classList.add("col-xl-3", "col-md-6", "mb-xl-0", "mb-4", "mt-4");
                                nuevoContenedor.appendChild(productoNuevo);
                                resultadosEncontrados = true;
                            } 
            
                        });

                        return resultadosEncontrados

                    }
                } catch (error) {
                    
                    console.error(error);



                }

            };
            resultadosEncontrados = cargardatos2();
            
            

        };

        if (buscarTexto === "") {

            productos.forEach((producto) => {
                let productoNuevo = document.createElement("div");
                productoNuevo.innerHTML = producto.innerHTML;
                productoNuevo.classList.add("col-xl-3", "col-md-6", "mb-xl-0", "mb-4", "mt-4");
                nuevoContenedor.appendChild(productoNuevo);
        
            });

        } else {
            productos.forEach((producto) => {

                let nombre = producto.querySelector("h5").textContent.toLowerCase().trim();
                let tipo = producto.querySelector("p.text-sm").textContent.toLowerCase().trim();
                
                if (nombre.includes(buscarTexto) || tipo.includes(buscarTexto)) {

                    let productoNuevo = document.createElement("div");
                    productoNuevo.innerHTML = producto.innerHTML;
                    productoNuevo.classList.add("col-xl-3", "col-md-6", "mb-xl-0", "mb-4", "mt-4");
                    nuevoContenedor.appendChild(productoNuevo);
                    resultadosEncontrados = true;

                } 

            });
        }

        //Mostrar mensaje en caso de que el usuario quiera buscar contenido inexistente en nuestro sistema
        if (!resultadosEncontrados) {
            let mensaje = document.createElement("p");
            mensaje.textContent = "No se encontraron datos";
            nuevoContenedor.appendChild(mensaje);
            nuevoContenedor.style.textAlign = "center";

        }

    };

    boton.addEventListener("click", () => {

        buscar();

    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {

            buscar();

        }
    });



    

};

document.addEventListener("DOMContentLoaded", function () {

    cargarDatosPlantilla();
    buscarContenido();

});