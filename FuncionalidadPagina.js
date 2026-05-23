const productos = [
  {
    id: 1,
    nombre: "Bandeja Paisa",
    precio: 22000,
    categoria: "rescatada",
    emoji: "🍽️",
    descripcion: "Frijoles, arroz, carne molida, chicharrón, huevo, plátano y aguacate.",
    impacto: "Ingredientes frescos rescatados de productores locales."
  },
  {
    id: 2,
    nombre: "Lentejas con Chorizo",
    precio: 16000,
    categoria: "paga",
    emoji: "🍲",
    descripcion: "Guiso tradicional con lentejas, chorizo y verduras frescas.",
    impacto: "Comida nutritiva accesible para todos."
  },
  {
    id: 3,
    nombre: "Pescado a la Milanesa",
    precio: 26000,
    categoria: "rescatada",
    emoji: "🐟",
    descripcion: "Filete de pescado empanizado con arroz, ensalada y patacones.",
    impacto: "Pescado fresco salvado del desperdicio."
  },
  {
    id: 4,
    nombre: "Pollo al Horno con Papas",
    precio: 20000,
    categoria: "paga",
    emoji: "🍗",
    descripcion: "Presa de pollo asado con papas criollas y ensalada fresca.",
    impacto: "Proteína de calidad para familias necesitadas."
  },
  {
    id: 5,
    nombre: "Parrillada Mixta",
    precio: 38000,
    categoria: "rescatada",
    emoji: "🥩",
    descripcion: "Carne de res, pollo, chorizo, morcilla, papas y arepas.",
    impacto: "Carnes premium recuperadas de excedentes."
  },
  {
    id: 6,
    nombre: "Costillas Ahumadas",
    precio: 28000,
    categoria: "rescatada",
    emoji: "🍖",
    descripcion: "Costillas de cerdo ahumadas con salsa BBQ, arroz y ensalada.",
    impacto: "Aprovechamiento de cortes premium rescatados."
  },
  {
    id: 7,
    nombre: "Jugo Natural",
    precio: 5000,
    categoria: "paga",
    emoji: "🧃",
    descripcion: "Jugo natural del día, sin conservantes ni azúcar añadida.",
    impacto: "Bebida saludable para acompañar tu comida."
  },
  {
    id: 8,
    nombre: "Gaseosa",
    precio: 4000,
    categoria: "paga",
    emoji: "🥤",
    descripcion: "Gaseosa colombiana de 400ml.",
    impacto: "Bebida accesible para completar tu pedido."
  }
];

const cantidadesPedido = {};
let filtroActual = "todos";
let donacionSeleccionada = 10000;

// Referencias DOM
const menuCards = document.querySelector("#menuCards");
const orderProducts = document.querySelector("#orderProducts");
const totalPagar = document.querySelector("#totalPagar");
const resumenDescuento = document.querySelector("#resumenDescuento");
const mensajePedido = document.querySelector("#mensajePedido");

const nombreClienteInput = document.querySelector("#nombreCliente");
const presupuestoClienteInput = document.querySelector("#presupuestoCliente");
const btnRealizarPedido = document.querySelector("#btnRealizarPedido");

const botonesFiltro = document.querySelectorAll(".filter-btn");

const botonesDonacion = document.querySelectorAll(".donation-amount");
const customDonation = document.querySelector("#customDonation");
const donationValue = document.querySelector("#donationValue");
const peopleHelped = document.querySelector("#peopleHelped");
const btnDonar = document.querySelector("#btnDonar");
const mensajeDonacion = document.querySelector("#mensajeDonacion");

// Utilidades
function formatearMoneda(valor) {
  return `$${valor.toLocaleString("es-CO")}`;
}

function obtenerEtiquetaCategoria(categoria) {
  if (categoria === "rescatada") {
    return "♻ Rescatado";
  } else if (categoria === "paga") {
    return "♡ Paga lo que puedas";
  } else {
    return "General";
  }
}

// Render menú principal (cards)
function renderMenu() {
  let listaFiltrada = [];

  if (filtroActual === "todos") {
    listaFiltrada = productos;
  } else if (filtroActual === "rescatada") {
    listaFiltrada = productos.filter(function (p) {
      return p.categoria === "rescatada";
    });
  } else {
    listaFiltrada = productos.filter(function (p) {
      return p.categoria === "paga";
    });
  }

  menuCards.innerHTML = "";

  listaFiltrada.forEach(function (producto) {
    const card = document.createElement("article");
    card.classList.add("menu-card");

    card.innerHTML = `
      <div class="menu-card-top">${producto.emoji}</div>
      <div class="menu-card-body">
        <h4>${producto.nombre}</h4>
        <span class="badge ${producto.categoria}">${obtenerEtiquetaCategoria(producto.categoria)}</span>
        <p class="desc">${producto.descripcion}</p>
        <p class="impact-text"><strong>Impacto social:</strong> ${producto.impacto}</p>
        <div class="price-row">
          <strong>${formatearMoneda(producto.precio)}</strong>
          <button class="btn btn-primary btn-pedir" data-id="${producto.id}">Pedir</button>
        </div>
      </div>
    `;

    menuCards.appendChild(card);
  });

  // Eventos de botones "Pedir"
  const botonesPedir = document.querySelectorAll(".btn-pedir");
  botonesPedir.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const idProducto = Number(btn.dataset.id);
      if (!cantidadesPedido[idProducto]) {
        cantidadesPedido[idProducto] = 0;
      }
      cantidadesPedido[idProducto] += 1;
      renderOrderProducts();
      calcularTotal();
      mostrarMensajeTemporal("Producto agregado al pedido ✅", "ok", mensajePedido);
    });
  });
}

// Render lista de pedido con + y -
function renderOrderProducts() {
  orderProducts.innerHTML = "";

  productos.forEach(function (producto) {
    if (!cantidadesPedido[producto.id]) {
      cantidadesPedido[producto.id] = 0;
    }

    const fila = document.createElement("div");
    fila.classList.add("order-item");

    fila.innerHTML = `
      <div>
        <h4>${producto.nombre}</h4>
        <strong>${formatearMoneda(producto.precio)}</strong>
      </div>
      <div class="counter">
        <button class="btn-less" data-action="less" data-id="${producto.id}">-</button>
        <span class="count" id="count-${producto.id}">${cantidadesPedido[producto.id]}</span>
        <button class="btn-more" data-action="more" data-id="${producto.id}">+</button>
      </div>
    `;

    orderProducts.appendChild(fila);
  });

  const botonesContador = orderProducts.querySelectorAll("button");

  botonesContador.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const id = Number(boton.dataset.id);
      const accion = boton.dataset.action;

      if (accion === "more") {
        cantidadesPedido[id] += 1;
      } else if (accion === "less") {
        if (cantidadesPedido[id] > 0) {
          cantidadesPedido[id] -= 1;
        }
      }

      document.querySelector(`#count-${id}`).textContent = cantidadesPedido[id];
      calcularTotal();
    });
  });
}

function calcularSubtotal() {
  let subtotal = 0;

  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const cantidad = cantidadesPedido[producto.id] || 0;
    subtotal += producto.precio * cantidad;
  }

  return subtotal;
}

function calcularCantidadItems() {
  let items = 0;

  for (const idProducto in cantidadesPedido) {
    items += cantidadesPedido[idProducto];
  }

  return items;
}

// Reglas de descuento con if / else if / else
function calcularDescuento(subtotal, cantidadItems) {
  let porcentaje = 0;
  let mensaje = "Sin descuento aplicado.";

  if (cantidadItems >= 8) {
    porcentaje = 15;
    mensaje = "Descuento del 15% por pedir 8 o más productos.";
  } else if (cantidadItems >= 5) {
    porcentaje = 10;
    mensaje = "Descuento del 10% por pedir 5 o más productos.";
  } else if (subtotal >= 100000) {
    porcentaje = 8;
    mensaje = "Descuento del 8% por compra mayor a $100.000.";
  } else {
    porcentaje = 0;
    mensaje = "Sin descuento aplicado.";
  }

  return { porcentaje, mensaje };
}

function calcularTotal() {
  const subtotal = calcularSubtotal();
  const items = calcularCantidadItems();

  const descuentoInfo = calcularDescuento(subtotal, items);
  const valorDescuento = Math.round((subtotal * descuentoInfo.porcentaje) / 100);
  const total = subtotal - valorDescuento;

  totalPagar.textContent = formatearMoneda(total);
  resumenDescuento.textContent = `${descuentoInfo.mensaje} (Ahorras ${formatearMoneda(valorDescuento)}).`;
}

// Pedido final
btnRealizarPedido.addEventListener("click", function () {
  const nombreCliente = document.querySelector("#nombreCliente").value.trim();
  const presupuestoCliente = Number(document.querySelector("#presupuestoCliente").value);

  const subtotal = calcularSubtotal();
  const items = calcularCantidadItems();
  const descuentoInfo = calcularDescuento(subtotal, items);
  const total = subtotal - Math.round((subtotal * descuentoInfo.porcentaje) / 100);

  if (nombreCliente === "") {
    mostrarMensajeTemporal("Debes ingresar tu nombre para continuar.", "error", mensajePedido);
    return;
  }

  if (items === 0) {
    mostrarMensajeTemporal("Selecciona al menos un producto para realizar el pedido.", "error", mensajePedido);
    return;
  }

  if (isNaN(presupuestoCliente) || presupuestoCliente <= 0) {
    mostrarMensajeTemporal("Ingresa un presupuesto válido.", "error", mensajePedido);
    return;
  }

  if (presupuestoCliente < total) {
    const faltante = total - presupuestoCliente;
    mostrarMensajeTemporal(
      `Tu presupuesto no alcanza. Te faltan ${formatearMoneda(faltante)}.`,
      "error",
      mensajePedido
    );
  } else {
    let comidasDonadas = 0;
    if (items >= 3) {
      comidasDonadas = Math.floor(items / 3);
    }

    mostrarMensajeTemporal(
      `¡Gracias ${nombreCliente}! Pedido realizado por ${formatearMoneda(total)}. Hoy ayudaste a donar ${comidasDonadas} comida(s).`,
      "ok",
      mensajePedido
    );

    // Reiniciar pedido
    for (const idProducto in cantidadesPedido) {
      cantidadesPedido[idProducto] = 0;
    }
    nombreClienteInput.value = "";
    presupuestoClienteInput.value = "";
    renderOrderProducts();
    calcularTotal();
  }
});

function mostrarMensajeTemporal(texto, tipo, elemento) {
  elemento.textContent = texto;
  elemento.classList.remove("ok", "error");
  elemento.classList.add(tipo);
}

// Filtros menú
botonesFiltro.forEach(function (btn) {
  btn.addEventListener("click", function () {
    botonesFiltro.forEach(function (b) {
      b.classList.remove("active");
    });

    btn.classList.add("active");
    filtroActual = btn.dataset.filter;
    renderMenu();
  });
});

// Donaciones
function actualizarDonacionUI(valor) {
  donationValue.textContent = formatearMoneda(valor);

  let personas = 0;
  if (valor <= 0) {
    personas = 0;
  } else {
    personas = Math.floor(valor / 10000);
  }

  peopleHelped.textContent = personas;
}

botonesDonacion.forEach(function (btn) {
  btn.addEventListener("click", function () {
    botonesDonacion.forEach(function (b) {
      b.classList.remove("active");
    });

    btn.classList.add("active");
    donacionSeleccionada = Number(btn.dataset.amount);
    customDonation.value = "";
    actualizarDonacionUI(donacionSeleccionada);
  });
});

customDonation.addEventListener("input", function () {
  const valorPersonalizado = Number(customDonation.value);

  if (!isNaN(valorPersonalizado) && valorPersonalizado > 0) {
    botonesDonacion.forEach(function (b) {
      b.classList.remove("active");
    });
    donacionSeleccionada = valorPersonalizado;
    actualizarDonacionUI(donacionSeleccionada);
  } else {
    actualizarDonacionUI(0);
  }
});

btnDonar.addEventListener("click", function () {
  const valor = donacionSeleccionada;

  if (isNaN(valor) || valor <= 0) {
    mostrarMensajeTemporal("Ingresa o selecciona un valor de donación válido.", "error", mensajeDonacion);
    return;
  }

  let mensajeExtra = "";
  if (valor >= 100000) {
    mensajeExtra = " ¡Eres un héroe solidario! 🌟";
  } else if (valor >= 50000) {
    mensajeExtra = " Tu aporte tendrá un gran impacto 💪";
  } else {
    mensajeExtra = " Toda ayuda cuenta y transforma vidas 🧡";
  }

  mostrarMensajeTemporal(
    `Donación registrada por ${formatearMoneda(valor)}.${mensajeExtra}`,
    "ok",
    mensajeDonacion
  );

  customDonation.value = "";
});

// Inicialización (secuencia principal)
renderMenu();
renderOrderProducts();
calcularTotal();
actualizarDonacionUI(donacionSeleccionada);
