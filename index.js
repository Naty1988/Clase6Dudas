const express = require('express')
const app = express()
const puerto = 8080
const fs = require('fs')

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName
        fs.promises.writeFile(`./${fileName}`, '')
    }

    async save(objeto) {
        let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')

        if (!data) {
            objeto.id = 1
            const arr = [objeto]
            await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(arr))
            return objeto.id
        } else {
            data = JSON.parse(data);
            objeto.id = data.length + 1
            data.push(objeto)
            await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(data))
            return objeto.id
        }
    }

    async getAll() {

        let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
        if (data) {

            data = JSON.parse(data);
            return data
        } else {
            console.log("No hay data")
        }

    }

    async getById(number) {
        let data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')

        if (data) {

            data = JSON.parse(data);
            let encontrado = data.find(elemento => elemento.id === number)
            if (encontrado) {

                return encontrado
            } else {
                console.log(`No se encontraton productos con el id ${number}`, null)
            }

        } else {
            console.log("No hay data")
        }
    }
}

const productos = new Contenedor('productos.txt')

productos.save({ title: 'Escuadra', price: '123.45', thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png" }).then(id => {
    console.log("Se creó producto id: ", id)
    productos.save({ title: 'Calculadora', price: '234.56', thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png" }).then(id => {
        console.log("Se creó producto id: ", id)
        productos.save({ title: 'Globo Terráqueo', price: '345.67', thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png" }).then(id => {
            console.log("Se creó producto id: ", id)
        })
    })

})

app.listen(puerto, (error) => {
    if (!error) {
        console.log(`Escuchando al servidor en puerto: ${puerto}`)
    } else {
        console.log(`Ocurrió el siguiente error: ${error}`)
    }
})

let data

app.get('/productos', (req, res) => {

    data = productos.getAll().then((data) => {

        console.log("Productos traidos de la base de datos")

        res.send(data.map(product => `<h1>Productos:${product.title}</h1> 
                                        <h2>Precio: ${product.price}</h2>
                                        <h2>id: ${product.id}</h2>
                                        <img src: ${product.thumbnail}>`))
    })
})

let encontrado

app.get('/productoRandom', (req, res) => {

    let random = Math.floor(Math.random() * (3 - 1 + 1)) + 1

    encontrado = productos.getById(random).then((encontrado) => {
        console.log(encontrado)
        for (const enc of encontrado) {
            `<h1>Productos:${enc.title}</h1>    
                                    <h2>Precio: ${enc.price}</h2>
                                    <h2>id: ${enc.id}</h2>  <img src: ${enc.thumbnail}>`
        }
    })

    res.send("Producto render en consola")
})