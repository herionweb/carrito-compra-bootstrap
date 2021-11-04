const d = document;
const $cards = d.getElementById("cards");
const $items = d.getElementById("items");
const $footer = d.getElementById("footer");
const $templateCard = d.getElementById("template-card").content;
const $templateFooter = d.getElementById("template-footer").content;
const $templateCarrito = d.getElementById("template-carrito").content;
const $fragment = d.createDocumentFragment();
let carrito = {};

d.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
});

$cards.addEventListener("click", e => {
  addCarrito(e);
});

d.addEventListener("click", e => {
  vaciarCarro(e);
});

$items.addEventListener("click", e => {
  btnAccion(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("api.json")
    const data = await res.json();
    pintarCards(data);

  } catch (error) {
    console.log(error)
  }
}

const pintarCards = (data) => {
  data.forEach(card => {
    // console.log(card);
    $templateCard.querySelector("h5").textContent = card.title;
    $templateCard.querySelector("p").textContent = card.precio;
    $templateCard.querySelector("img").setAttribute("src", card.thumbnailUrl);
    $templateCard.querySelector(".btn-dark").dataset.id = card.id;

    clone = $templateCard.cloneNode(true);
    $fragment.appendChild(clone);
  });
  $cards.appendChild($fragment);
}

const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    // console.log(e.target.parentElement);
    setcarrito(e.target.parentElement);

  }
  e.stopPropagation();
}

const setcarrito = objeto => {
  // console.log(objeto);
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
    title: objeto.querySelector("h5").textContent
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  // console.log(producto);
  pintarCarrito();
}

const pintarCarrito = () => {
  $items.innerHTML = "";
  Object.values(carrito).forEach(producto => {
    // console.log(producto);
    items.innerHTML = "";
    $templateCarrito.querySelector("th").textContent = producto.id;
    $templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    $templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    $templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    $templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    $templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;


    const clone = $templateCarrito.cloneNode(true);
    $fragment.appendChild(clone);

  });

  $items.appendChild($fragment);

  pintarFooter();

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

const pintarFooter = () => {
  $footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    $footer.innerHTML = `<th scope="row" colspan="5">Aún no ha elegido ningún producto!</th>`;
    return;
  }

  const ncantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
  const nprecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);

  $templateFooter.querySelectorAll("td")[0].textContent = ncantidad;
  $templateFooter.querySelector("span").textContent = nprecio;

  const clone = $templateFooter.cloneNode(true);
  $fragment.appendChild(clone);
  footer.appendChild($fragment);

}

const vaciarCarro = e => {
  if (e.target.matches("#vaciar-carrito")) {
    carrito = {};
    pintarCarrito();
  }
}

const btnAccion = e => {
  if (e.target.matches(".btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }

  if (e.target.matches(".btn-danger")) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--;

    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    } else {
      carrito[e.target.dataset.id] = { ...producto };

    }
    pintarCarrito();
  }
  e.stopPropagation();
}

