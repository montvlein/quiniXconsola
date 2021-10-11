const fs = require('fs')
const readline = require('readline')
let registroSorteos = JSON.parse(fs.readFileSync('concursos.json'))

class sorteo {
    constructor() {
        this.fecha = new Date()
        this.tipo = this.tipo(this.fecha).nombre
        this.numerosGanadores = null
    }

    sortear() {
        this.numerosGanadores = new numerosGanadores()
    }

    tipo(hora) {
        return tipoConcurso.find(tipo => tipo.horario === `${hora.getHours()}:${hora.getMinutes()}:${hora.getSeconds()}`)
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
        horario: '12:0:0'
    },
    {
        nombre: 'Matutina',
        horario: '15:0:0'
    },
    {
        nombre: 'Vespertina',
        horario: '17:30:0'
    },
    {
        nombre: 'Nocturna',
        horario: '21:0:0'
    }
]
// let hora
// hora = new Date(2021, 9, 10, 12, 0)
// hora = new Date(2021, 9, 10, 15, 0)
// hora = new Date(2021, 9, 10, 17, 30)
// hora = new Date(2021, 9, 10, 21, 0)

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
    fs.writeFileSync('concursos.json',JSON.stringify(registroSorteos))
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

function siguiente() {
    let indice = tipoConcurso.indexOf(tipoConcurso.find(concurso => concurso.nombre === registroSorteos[registroSorteos.length-1].tipo))
    if (indice+1<=3) {
        return tipoConcurso[indice+1]
    } else {
        return tipoConcurso[0]
    }
}

function abrir() {
    interface.question(`A que juegas:\n${printOpciones}`, valor => {

        if (valor == 0 || valor == 1 || valor == 2 ) {
            console.log(`elegiste la opcion: ${opciones[valor]}`)
            interface.question('selecciona un numero\n', num => {
                
                console.log(`seleccionaste el numero ${num} ${opciones[valor]}`)
                console.log('\niniciando Quiniela\n'.toUpperCase())
                setInterval( ()=> {
                    try {
                        quini()
                        ganadores(opciones[valor], num)
                        console.log(`sigueinte concurso: ${siguiente().nombre} fecha:${siguiente().horario}`)
                    } catch (err) {
                        let tiempo = siguiente().horario.split(':')
                        tiempo = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), tiempo[0], tiempo[1], 0)
                        console.log(`tiempo restante hasta el siguiente concurso: ${new Date(tiempo-new Date()).getHours()-19}:${new Date(tiempo-new Date()).getMinutes()}:${new Date(tiempo-new Date()).getSeconds()}`)                       
                    }
                },1000)
                interface.close()
                console.log('cerrando interface')
            })
        } else {
            abrir()
        }
    })
}


function mostraRegistros() {
    console.log('mostrando lista de sorteos hasta la fecha\n');
    console.table(registroSorteos);
}

abrir()
