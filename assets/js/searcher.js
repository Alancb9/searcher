let loadProducts = async (myUrl) => {

    try {
        
        let jsonUrl = 'https://raw.githubusercontent.com/Bootcamp-Espol/Datos/main/products.json';
        let xmlUrl = 'https://raw.githubusercontent.com/Bootcamp-Espol/Datos/main/products.xml';

        let [jsonResponse, xmlResponse] = await Promise.all([fetch(jsonUrl), fetch(xmlUrl)]);

        let datosJson = await jsonResponse.json();
        let datosXml = await xmlResponse.text();

        let documentoXml = (new DOMParser).parseFromString(datosXml, 'application/xml');
        

    } catch (error) {
        
    };

};