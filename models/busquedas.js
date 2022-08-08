const fs = require("fs");
const axios = require("axios");

class Busquedas {
    historial = [];
    dbpath = "./db/database.json";

    constructor() {
        this.leerDB();
    }

    leerDB() {
        // Debe existir el archivo
        if (!fs.existsSync(this.dbpath)) {
            return null;
        }

        const info = fs.readFileSync(this.dbpath, "utf-8");
        const data = JSON.parse(info);
        this.historial = data.historial;
        return data;
    }

    get paramsMapBox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: "es",
        };
    }

    async ciudad(termino = "") {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${termino}.json`,
                params: this.paramsMapBox,
            });
            const resp = await instance.get();

            return resp.data.features.map((termino) => ({
                id: termino.id,
                nombre: termino.place_name,
                lng: termino.center[0],
                lat: termino.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    agregarHistorial(lugarSel = "") {
        // prevenir duplicador
        if (this.historial.includes(lugarSel.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 5);
        this.historial.unshift(lugarSel.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial,
        };

        fs.writeFileSync(this.dbpath, JSON.stringify(payload));
    }

    get paramsClima() {
        return {
            appid: process.env.OPEN_WEATHER_KEY,
            units: "metric",
            lang: "es",
        };
    }

    async climaLugar(lat, lon) {
        // https://api.openweathermap.org/data/2.5/weather?lat=-12.0523&lon=-77.1391&appid=467f94cfe392de0d06cc4c7fd64d0495&units=metric&lang=es
        try {
            const instancia = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsClima, lat, lon },
            });
            const resp = await instancia.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };
        } catch (error) {
            return [];
        }
    }

    get historialCapitalizado() {
        // Capitalizar cada palabra
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ')

        })
    }
}

module.exports = Busquedas;
