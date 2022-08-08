require('dotenv').config();

const { inquireMenu, leerInput, pausa, listarLugares } = require("./helpers/inquireMenu");
const Busquedas = require("./models/busquedas");


const main = async () => {
    let opt;
    const busquedas = new Busquedas();

    do {
        opt = await inquireMenu();

        switch (opt) {
            case 1:
                // leerInput retorna la palabra ingresada por teclado
                const termino = await leerInput("Ingrese un lugar:")

                // buscar los lugares
                const lugares = await busquedas.ciudad(termino)

                // seleccionar el lugar:
                const id = await listarLugares(lugares);
                if(id==='0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                // guardar en la bd:
                busquedas.agregarHistorial(lugarSel.nombre)

                // !* clima:
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                console.clear();
                console.log('Información de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:',clima.temp);
                console.log('Mínima:',clima.min);
                console.log('Máxima:',clima.max);
                console.log('Cómo está el clima:', clima.desc.yellow);
                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1}`.green;
                    console.log(`${idx} - ${lugar}`);
                })
        
            default:
                break;
        }

        if (opt!==0) await pausa();
    } while (opt!==0);
}

main();