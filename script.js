const urlLocal = '../db.json';

let productos 

fetch(urlLocal)
.then(response => response.json())
.then(data =>{
  productos = data.productos
  localStorage.setItem("productos", JSON.stringify(productos))
  console.log(productos)
}
)



/* 
let productos = [
  { id: 60500, nombre: "Tortuga", categoria: "Lámparas de mesa", stock: 2, precio: 40000, rutaImagen: "Tortuga-Art-60500.jpg" },
  { id: 60203, nombre: "Odín", categoria: "Lámparas de mesa", stock: 20, precio: 28500, rutaImagen: "Odín-Art-60203.png" },
  { id: 60710, nombre: "Tortuga", categoria: "Lámparas de mesa", stock: 4, precio: 30000, rutaImagen: "Tortuga-Art-60710.jpg" },
  { id: 1200, nombre: "Dixon", categoria: "Colgantes", stock: 6, precio: 15000, rutaImagen: "Dixon-Art-1200.jpg" },
  { id: 1212, nombre: "Odín", categoria: "Colgantes", stock: 3, precio: 18000, rutaImagen: "Odín-Art-1212.png" },
  { id: 1300, nombre: "Dixon", categoria: "Colgantes", stock: 2, precio: 5600, rutaImagen: "Dixon-Art-1300.jpg" },
  { id: 77710, nombre: "Tortuga", categoria: "Lámparas de pie", stock: 7, precio: 2650, rutaImagen: "Tortuga-Art-77710.jpg" },
  { id: 66000, nombre: "Odín", categoria: "Lámparas de pie", stock: 9, precio: 2650, rutaImagen: "Odín-Art-66000.png" },
  { id: 7820, nombre: "Pixar XL", categoria: "Lámparas de pie", stock: 8, precio: 50000, rutaImagen: "PixarXL-Art-7820.png" },
  { id: 30900, nombre: "Dixon", categoria: "Aplique de pared", stock: 1, precio: 2650, rutaImagen: "Dixon-Art-30900.jpg" },
  { id: 30905, nombre: "Dixon", categoria: "Aplique de pared", stock: 10, precio: 2650, rutaImagen: "Dixon-Art-30905.png" },
  { id: 3460, nombre: "Tortuga", categoria: "Aplique de pared", stock: 15, precio: 50000, rutaImagen: "Tortuga-Art-3460.png" }
] */

let carritoStorage = JSON.parse(localStorage.getItem("carrito"))

let carrito = carritoStorage ? carritoStorage : []



let input = document.getElementById("barraBusqueda")

input.addEventListener("input", () => filtrarYRenderizar(input.value))

renderizar()
renderizarCategorias()
activarBotonesCategoria()
renderizarCarrito()




function renderizarCategorias() {

  let productosEnStorage = JSON.parse(localStorage.getItem("productos"))

  let contenedorCategorias = document.getElementById("contenedorCategorias")
  contenedorCategorias.innerHTML = ""

  let categorias = []

  productosEnStorage.forEach(producto => {
   
    let categoria = producto.categoria

    let index = categorias.indexOf(categoria)
    if (index == -1) {

      categorias.push(categoria)
      

      let botonCategoria = document.createElement("button")
      botonCategoria.setAttribute('id', categoria)
      botonCategoria.innerHTML = `
      ${categoria}
      `
      botonCategoria.classList.add("animate__animated", "animate__bounceIn")
      botonCategoria.style.border = "1px solid grey" 
      botonCategoria.style.backgroundColor = "white"
      botonCategoria.style.color = "black" 
      botonCategoria.style.padding = "5px" 
      botonCategoria.style.borderRadius = "10px"
      contenedorCategorias.appendChild(botonCategoria)


    }

  })

  let botonLimpiarFiltros = document.createElement("button")
  botonLimpiarFiltros.setAttribute("id", "limpiarFiltro")
  botonLimpiarFiltros.innerHTML = `
      Limpiar Filtros
      `
  botonLimpiarFiltros.style.border = "1px solid grey"
  botonLimpiarFiltros.style.backgroundColor = "white"
  botonLimpiarFiltros.style.color = "black"
  botonLimpiarFiltros.style.padding = "5px"
  botonLimpiarFiltros.style.borderRadius = "10px"
  botonLimpiarFiltros.addEventListener("click", () => resetCategorias(contenedorProductos))
  contenedorCategorias.appendChild(botonLimpiarFiltros)


}

function renderizar(conFiltros) {

  let productosEnStorage

  if (conFiltros) {
    productosEnStorage = JSON.parse(localStorage.getItem("productosFiltrados"))
  } else {
    productosEnStorage = JSON.parse(localStorage.getItem("productos"))
  }

  let contenedorProductos = document.getElementById("contenedorProductos")
  contenedorProductos.innerHTML = ""

  productosEnStorage.forEach(productosEnStorage => {
    let tarjetaProducto = document.createElement("div")
    let idProducto = productosEnStorage.id


    tarjetaProducto.classList.add("tarjetaProducto")
    tarjetaProducto.setAttribute("id", productosEnStorage.categoria)
    tarjetaProducto.setAttribute("label", productosEnStorage.id)

    tarjetaProducto.innerHTML = `
   <div class=imagen style="background-image: url(./images/${productosEnStorage.rutaImagen})"></div>
   <h2> ${productosEnStorage.nombre} </h2>
   <h3> ${"Art. " + productosEnStorage.id} </h3>
   <h4> ${"$" + productosEnStorage.precio} </h4>
 
   <button class=boton-tarjeta-producto id=${productosEnStorage.id}> Agregar al carrito </button>
   `
    contenedorProductos.appendChild(tarjetaProducto)
    let botonAgregarAlCarrito = document.getElementById(productosEnStorage.id)
    botonAgregarAlCarrito.addEventListener("click", () => agregarAlCarrito(productos, idProducto, carrito))
  })
}

function agregarAlCarrito(productos, idProducto, carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito))
  console.log(idProducto)

  let productoBuscado = productos.find(producto => producto.id === idProducto)
  let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === idProducto)

  if (posicionProductoEnCarrito !== -1) {
    carrito[posicionProductoEnCarrito].unidades++
    carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].unidades * carrito[posicionProductoEnCarrito].precioUnitario
  } else {
    carrito.push({
      id: productoBuscado.id,
      nombre: productoBuscado.nombre,
      precioUnitario: productoBuscado.precio,
      unidades: 1,
      subtotal: productoBuscado.precio
    })
  }
  lanzarToast()
  localStorage.setItem("carrito", JSON.stringify(carrito))
  renderizarCarrito()
}

function renderizarCarrito() {
  const contenedorCarrito = document.getElementById("contenedor-carrito")
  contenedorCarrito.innerHTML = ""

  carrito.forEach(carrito => {
    let tarjetaCarrito = document.createElement("div")

    tarjetaCarrito.classList.add("tarjetaCarrito")

    tarjetaCarrito.innerHTML = `
   <h2> ${carrito.nombre} </h2>
   <h3> ${"Art. " + carrito.id} </h3>
   <h4> ${"$" + carrito.precioUnitario} </h4>
   <h4> ${"Cantidad: " + carrito.unidades} </h4>
   <h4> ${"Sub-total: $" + carrito.subtotal} </h4>
   <button id=${carrito.id} onclick="removerDelCarrito(${carrito.id})"> Remover del carrito </button>
   <hr>
   `
    contenedorCarrito.appendChild(tarjetaCarrito)
  })
}

function removerDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderizarCarrito();
}

document.getElementById("finalizar-compra").addEventListener("click", function() {
  lanzarAlert("¡Compra realizada!", "Gracias por tu compra.", "success", "Aceptar")
}); 

function filtrarProductosPorCategoria(contenedorProductos, idBoton) {

  resetCategorias(contenedorProductos)
  let tarjetasProductos = contenedorProductos.children
  for (let i = 0; i < tarjetasProductos.length; i++) {
    let tarjeta = tarjetasProductos[i]
    let categoriaTarjeta = tarjeta.getAttribute("id")

    if (categoriaTarjeta !== idBoton) {
      tarjeta.style.display = "none"
    }

  }

}

function activarBotonesCategoria() {

  let botones = document.getElementById("contenedorCategorias").children
  let contenedorProductos = document.getElementById("contenedorProductos")

  for (let i = 0; i < botones.length; i++) {
    let boton = botones[i]
    let idBoton = boton.getAttribute("id")
    if (idBoton !== "limpiarFiltro") {
      boton.addEventListener("click", () => filtrarProductosPorCategoria(contenedorProductos, idBoton))
    }
  }

}

function resetCategorias(contenedorProductos) {
  let tarjetasProductos = contenedorProductos.children
  for (let i = 0; i < tarjetasProductos.length; i++) {
    let tarjeta = tarjetasProductos[i]
    tarjeta.style.display = "flex"
  }
}

function filtrarYRenderizar(valorFiltro) {
  let conFiltros = true
  let productosEnStorage = JSON.parse(localStorage.getItem("productos"))
  let elementosFiltrados = productosEnStorage.filter(elemento => elemento.nombre.toLowerCase().includes(valorFiltro.toLowerCase()))
  localStorage.setItem("productosFiltrados", JSON.stringify(elementosFiltrados))
  renderizar(conFiltros)
}



function lanzarAlert(title, text, icon, confirmButtonText) {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    timer: 1000
  })
}


function lanzarToast() {
  Toastify({
    text: "Producto agregado al carrito",
    className: "info",
    position: "center",
    style: {
      background: "black",
      borderRadius: "10px",
    }
  }).showToast();
}


let footer = document.createElement("footer")
footer.innerHTML = "Luz interior srl"
footer.style.backgroundColor = "gray"
footer.style.color = "white"
footer.style.padding = "5px"
footer.style.textAlign = "center"
document.body.appendChild(footer);
