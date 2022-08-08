const inquirer = require("inquirer");
require("colors");

const inquireMenu = async () => {
    const question = [
        {
            type: "list",
            name: "opcion",
            message: "Seleccione una opción:",
            choices: [
                {
                    value: 1,
                    name: `${"1.".green} Buscar ciudad`,
                },
                {
                    value: 2,
                    name: `${"2.".green} Lista historial`,
                },
                {
                    value: 0,
                    name: `${"0.".green} Salir`,
                },
            ],
        },
    ];
    console.clear();

    console.log("==============================".green);
    console.log("     Seleccione una opcion:    ".yellow);
    console.log("==============================\n".green);

    const { opcion } = await inquirer.prompt(question);
    return opcion;
};

const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor'
                }
                return true;
            }
        }
    ]
    const {desc} = await inquirer.prompt(question);
    return desc;
}

const pausa = async () => {
    const question = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${"ENTER".green} para continuar`,
        },
    ];
    console.log("\n");
    await inquirer.prompt(question);
};

const listarLugares = async(lugares=[]) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i+1}`.green;
        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`,
        }
    })
    choices.unshift({
        value: '0',
        name: '0'.green + '. Cancelar',
    })
    

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione un lugar: ',
            choices
        }
    ]
    const {id} = await  inquirer.prompt(preguntas)
    return id;
}

module.exports = {
    inquireMenu,
    leerInput,
    pausa,
    listarLugares
};
