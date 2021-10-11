const fs = require('fs')
const readline = require('readline')
let registroSorteos = JSON.parse(fs.readFileSync('concursos.json'))

class sorteo {
    constructor() {
        this.fecha = new Date(2021, 9, 10, 21, 0)
        this.tipo = this.tipo(this.fecha).nombre
        this.numerosGanadores = null
    }

    sortear() {
        this.numerosGanadores = new numerosGanadores()
    }

    tipo(hora) {
        return tipoConcurso.find(tipo => tipo.horario === `${hora.getHours()}:${hora.getMinutes()}`)
    }

}

class numerosGanadores {
    constructor() {
        for (let pos = 1; pos <= 20; pos++) {
            this[pos] = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        }
    }
}


const tipoConcurso = [
    {
        nombre: 'Primera',
        horario: '12:0'
    },
    {
        nombre: 'Matutina',
        horario: '15:0'
    },
    {
        nombre: 'Vespertina',
        horario: '17:30'
    },
    {
        nombre: 'Nocturna',
        horario: '21:0'
    }
]

const interface = readline.createInterface(process.stdin,process.stdout)
const opciones = ['a la cabeza', 'a los diez', 'a los 20']
const printOpciones = opciones.reduce((cont, opc, index) => cont + `${index}. ${opc}\n`, '')

function quini() {
    let evento = new sorteo()
    console.log(evento.fecha.toString());
    console.log(evento.tipo)
    evento.sortear()
    console.log('numeros ganadores');
    console.table(evento.numerosGanadores);
    registroSorteos.push(evento)
}

function ganadores(apuesta, numero) {
    let ganador
    let numerosSorteados = registroSorteos[registroSorteos.length-1].numerosGanadores
    switch (apuesta) {
        case 'a la cabeza':
            if (numerosSorteados[1] === numero) {
                console.log('ganaste\n'.toUpperCase())
                console.log(`el numero ${numero} salio en la posicion ${apuesta}`)
                ganador = true
            }
            break
        case 'a los diez':
            for (let n in numerosSorteados) {
                if (numerosSorteados[n] === numero && n<11) {
                    console.log('ganaste\n'.toUpperCase())
                    console.log(`el numero ${numero} salio en la posicion ${n}`)
                    ganador = true
                    break
                }
            }
            break
        case 'a los 20':
            for (let n in numerosSorteados) {
                if (numerosSorteados[n] === numero) {
                    console.log('ganaste\n'.toUpperCase())
                    console.log(`el numero ${numero} salio en la posicion ${n}`)
                    ganador = true
                    break
                }
            }
            break
    }
    if (!ganador) {
        console.log('en esta oportunidad no elegiste un numero ganador')
    }
}

function abrir() {
    interface.question(`A que juegas:\n${printOpciones}`, valor => {

        if (valor == 0 || valor == 1 || valor == 2 ) {
            console.log(`elegiste la opcion: ${opciones[valor]}`)
            interface.question('selecciona un numero\n', num => {
                
                console.log(`seleccionaste el numero ${num} ${opciones[valor]}`)
                try {
                    console.log('\niniciando Quiniela\n'.toUpperCase())
                    quini()
                    ganadores(opciones[valor], num)
                    console.log('cerrando la interface');
                } catch (error) {
                    console.error(error)
                }
                interface.close()
            })
        } else {
            abrir()
        }
    })
}

abrir()


// let hora
// hora = new Date(2021, 9, 10, 12, 0)
// hora = new Date(2021, 9, 10, 15, 0)
// hora = new Date(2021, 9, 10, 17, 30)
// hora = new Date(2021, 9, 10, 21, 0)

// setInterval( ()=> {
//     try {
//         console.log('iniciando nueva quiniela!\n');
//         quini()
//         console.log('mostrando lista de sorteos hasta la fecha\n');
//         console.table(registroSorteos);
//         fs.writeFileSync('concursos.json',JSON.stringify(registroSorteos))
//     } catch (error) {
//         console.error(error)
//     }
// }, 10000)