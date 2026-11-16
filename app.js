
const products = [
  {
    id: "jeans",
    name: "MTB JEANS",
    short: "MTB Jeans",
    tag: "THE MAIN EVENT",
    desc: "Trail-ready style. The centrepiece of Collection 001.",
    colours: [
      { name: "Washed Black", hex: "#252827" },
      { name: "Dark Blue", hex: "#23374b" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    price: null,
    code: "DENIM 001"
  },
  {
    id: "jersey",
    name: "MTB JERSEY",
    short: "MTB Jersey",
    tag: "THE SUPPORTING LINE-UP",
    desc: "A technical trail layer, made to move with you.",
    colours: [
      { name: "Black Gradient", hex: "linear-gradient(135deg,#090b0b,#565b57)" },
      { name: "White Gradient", hex: "linear-gradient(135deg,#f0eee7,#9b9d98)" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    price: null,
    code: "JERSEY 002"
  },
  {
    id: "hoodie",
    name: "CHAIN­SNAP HOODIE",
    short: "ChainSnap Hoodie",
    tag: "THE SUPPORTING LINE-UP",
    desc: "An everyday layer for before and after the ride.",
    colours: [
      { name: "Anthracite", hex: "#454a48" },
      { name: "Dark Olive Green", hex: "#343e2c" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    price: null,
    code: "HOODIE 003"
  }
];

let cart = JSON.parse(localStorage.getItem("chainsnap-cart") || "[]");

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function tape(label = "COMING SOON") {
  return `
    <div class="tape-stack">
      <span>${label}</span>
      <span>${label}</span>
    </div>
  `;
}

function productCard(product, compact = false) {
  const visual = `
    <div class="${compact ? "mini-visual" : "product-visual"}">
      <span class="visual-tag">${product.code}</span>
      ${tape()}
      <span class="tile-caption">VISUALS IN PROGRESS</span>
    </div>
  `;

  if (compact) {
    return `
      <article class="mini-card">
        ${visual}
        <div class="mini-info">
          <p class="eyebrow">${product.tag}</p>
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <div class="mini-foot">
            <span>£???</span>
            <a href="#shop">EXPLORE ↗</a>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="product-card" data-product="${product.id}">
      ${visual}
      <div class="product-info">
        <p class="eyebrow">${product.tag}</p>
        <h3>${product.name}</h3>
        <p class="product-desc">${product.desc}</p>

        <div class="product-controls">
          <span class="control-label">01 / CHOOSE YOUR COLOUR</span>
          <div class="swatches" role="group" aria-label="${product.short} colourways">
            ${product.colours.map((colour, index) => `
              <button
                class="swatch ${index === 0 ? "selected" : ""}"
                style="--swatch:${colour.hex}"
                data-colour="${index}"
                aria-label="${colour.name}"
                title="${colour.name}">
              </button>
            `).join("")}
            <span class="swatch-name">${product.colours[0].name}</span>
          </div>
        </div>

        <div>
          <label class="control-label" for="size-${product.id}">02 / SELECT SIZE</label>
          <select class="size-select" id="size-${product.id}">
            ${product.sizes.map(size => `<option>${size}</option>`).join("")}
          </select>
        </div>

        <div class="product-foot">
          <span>PRICE <b>£???</b></span>
          <span>${product.colours.length} COLOURWAYS</span>
        </div>

        <button class="add-button" data-add="${product.id}">
          ADD TO CART&nbsp;&nbsp; +
        </button>
      </div>
    </article>
  `;
}

function renderProducts() {
  $("#productGrid").innerHTML = products
    .map(product => productCard(product))
    .join("");

  $("#homeProducts").innerHTML = products
    .slice(1)
    .map(product => productCard(product, true))
    .join("");
}

function saveCart() {
  localStorage.setItem("chainsnap-cart", JSON.stringify(cart));
  renderCart();
  updateCount();
}

function updateCount() {
  $("#cartCount").textContent = cart.reduce(
    (total, item) => total + item.qty,
    0
  );
}

function renderCart() {
  const element = $("#cartItems");

  if (!cart.length) {
    element.innerHTML = `
      <div class="empty-cart">
        <p class="eyebrow">NOTHING IN THE BAG / YET</p>
        <h2>YOUR CART IS EMPTY.</h2>
        <p>Find your first link in the collection.</p>
        <a class="button button-primary" href="#shop">
          EXPLORE THE SHOP ↗
        </a>
      </div>
    `;

    $("#cartSubtotal").textContent = "£0.00";
    $("#cartTotal").textContent = "£0.00";
    return;
  }

  element.innerHTML = cart.map((item, index) => {
    const product = products.find(product => product.id === item.id);

    return `
      <div class="cart-row">
        <div class="cart-thumb">${tape()}</div>

        <div>
          <h3>${product.short.toUpperCase()}</h3>
          <p>${item.colour} / SIZE ${item.size}</p>

          <label class="control-label" for="qty-${index}">
            QUANTITY
          </label>

          <select id="qty-${index}" data-qty="${index}">
            ${[1, 2, 3, 4, 5].map(number => `
              <option ${number === item.qty ? "selected" : ""}>
                ${number}
              </option>
            `).join("")}
          </select>

          <button class="remove-item" data-remove="${index}">
            REMOVE
          </button>
        </div>

        <strong class="cart-price">£???</strong>
      </div>
    `;
  }).join("");

  $("#cartSubtotal").textContent = "TBC";
  $("#cartTotal").textContent = "TBC";
}

function toast(message) {
  const element = $("#toast");

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2300);
}

function navigate() {
  let page = location.hash.replace("#", "") || "home";

  if (!["home", "shop", "gallery", "faq", "cart"].includes(page)) {
    page = "home";
  }

  $$(".page").forEach(element => {
    element.classList.toggle("active", element.id === page);
  });

  $$("[data-nav]").forEach(link => {
    link.classList.toggle("active", link.dataset.nav === page);
  });

  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (page === "cart") {
    renderCart();
  }
}

document.addEventListener("click", event => {
  const swatch = event.target.closest(".swatch");

  if (swatch) {
    const card = swatch.closest(".product-card");

    card.querySelectorAll(".swatch").forEach(button => {
      button.classList.remove("selected");
    });

    swatch.classList.add("selected");

    const product = products.find(
      product => product.id === card.dataset.product
    );

    card.querySelector(".swatch-name").textContent =
      product.colours[Number(swatch.dataset.colour)].name;

    return;
  }

  const addButton = event.target.closest("[data-add]");

  if (addButton) {
    const product = products.find(
      item => item.id === addButton.dataset.add
    );

    const card = addButton.closest(".product-card");

    const colourIndex = Number(
      card.querySelector(".swatch.selected").dataset.colour
    );

    const size = card.querySelector("select").value;
    const colour = product.colours[colourIndex].name;

    const existingItem = cart.find(item =>
      item.id === product.id &&
      item.colour === colour &&
      item.size === size
    );

    if (existingItem) {
      existingItem.qty++;
    } else {
      cart.push({
        id: product.id,
        colour,
        size,
        qty: 1
      });
    }

    saveCart();
    toast(`${product.short} ADDED TO YOUR CART`);
    return;
  }

  const removeButton = event.target.closest("[data-remove]");

  if (removeButton) {
    cart.splice(Number(removeButton.dataset.remove), 1);
    saveCart();
    return;
  }
});

document.addEventListener("change", event => {
  if (event.target.matches("[data-qty]")) {
    cart[Number(event.target.dataset.qty)].qty =
      Number(event.target.value);

    saveCart();
  }
});

$("#menuToggle").addEventListener("click", () => {
  const open = $("#mainNav").classList.toggle("open");

  $("#menuToggle").setAttribute(
    "aria-expanded",
    String(open)
  );
});

$("#checkoutButton").addEventListener("click", () => {
  toast("CHECKOUT IS COMING SOON — THIS IS A DEMO CART");
});

window.addEventListener("hashchange", navigate);

renderProducts();
renderCart();
updateCount();
navigate();
