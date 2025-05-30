// script.js CORREGIDO: Código unificado y funcional para ArtesaMex

document.addEventListener('DOMContentLoaded', () => {
    // Datos de productos
    const products = [
        { id: 1, title: 'Alebrije Multicolor', category: 'Madera', description: 'Figura tallada y pintada a mano con diseños únicos y colores vibrantes.', price: '$850', image: 'assets/images/Productos/Alebrijes.webp' },
        { id: 2, title: 'Rebozo Tradicional', category: 'Textiles', description: 'Tejido a mano en telar con técnicas ancestrales y tintes naturales.', price: '$1,200', image: 'assets/images/Productos/Prendas de rebozo.webp' },
        { id: 3, title: 'Talavera Decorativa', category: 'Cerámica', description: 'Pieza de cerámica pintada a mano con diseños tradicionales de Puebla.', price: '$650', image: 'assets/images/Productos/Ceramica de Talavera.webp' },
        { id: 4, title: 'Collar de Plata', category: 'Joyería', description: 'Joyería fina de plata trabajada a mano por artesanos de Taxco.', price: '$1,200', image: 'assets/images/Productos/Collar de plata.webp' },
        { id: 5, title: 'Máscara Ceremonial', category: 'Madera', description: 'Máscara tallada en madera inspirada en tradiciones prehispánicas.', price: '$950', image: 'assets/images/Productos/Mascara Ceremonial.webp' },
        { id: 6, title: 'Huipil Bordado', category: 'Textiles', description: 'Prenda tradicional con bordados a mano de Chiapas.', price: '$1,800', image: 'assets/images/Productos/Huipil bordado.webp' },
        { id: 7, title: 'Árbol de la Vida', category: 'Cerámica', description: 'Pieza decorativa elaborada y pintada a mano en Metepec.', price: '$1,100', image: 'assets/images/Productos/Arbol de la vida.webp' },
        { id: 8, title: 'Aretes de Ámbar', category: 'Joyería', description: 'Aretes de plata con ámbar natural de Chiapas montado a mano.', price: '$624', image: 'assets/images/Productos/Aretes de ambar.webp' }
    ];

    // Filtro por categorías
    const categoryButtons = document.querySelectorAll('#productCategories .nav-link');
    const productItems = document.querySelectorAll('.producto');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            productItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                item.style.display = (category === 'all' || itemCategory === category) ? 'block' : 'none';
            });
        });
    });

    // Modal de productos
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const productId = parseInt(button.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
    // Asignar imagen según el botón
    const imageFromButton = button.getAttribute('data-image');
    if (imageFromButton) {
        const imgEl = document.getElementById('modalProductImage');
        imgEl.src = imageFromButton;
        imgEl.alt = product.title;
    }

    if (product) {
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductPrice').textContent = product.price;

    const imgEl = document.getElementById('modalProductImage');
    const imageFromButton = button.getAttribute('data-image');
    if (imageFromButton) {
        imgEl.src = imageFromButton;
    } else {
        imgEl.src = product.image;
    }
    imgEl.alt = product.title;

    const modalAddBtn = document.getElementById('modalAddToCart');
    if (modalAddBtn) {
    modalAddBtn.setAttribute('data-name', product.title);
    modalAddBtn.setAttribute('data-price', product.price.replace('$', '').replace(',', ''));
    }


    
    // Cargar reseñas en el modal
    loadModalReviews(productId);
    setupModalReviewForm(productId);      
    loadReviews(product.id); // Carga reseñas previas

    // Manejo de reseñas
    const form = document.getElementById('reviewForm');
    form.onsubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById('reviewUser').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const successMsg = document.getElementById('reviewSuccess');

        if (user && comment && rating) {
            const review = { user, rating, comment, date: new Date().toLocaleDateString() };
            const key = `reviews_product_${product.id}`;
            const existing = JSON.parse(localStorage.getItem(key)) || [];
            existing.push(review);
            localStorage.setItem(key, JSON.stringify(existing));
            form.reset();
            successMsg.style.display = 'block';
            setTimeout(() => successMsg.style.display = 'none', 2000);
            loadReviews(product.id); // Recarga la lista
        } else {
            alert('Completa todos los campos.');
        }
    };
}
});
}
});

function loadModalReviews(productId) {
  const container = document.getElementById('modalReviewsList');
  container.innerHTML = '';
  const reviews = JSON.parse(localStorage.getItem(`reviews_product_${productId}`)) || [];

  if (reviews.length === 0) {
    container.innerHTML = '<p class="text-muted">Aún no hay reseñas.</p>';
    return;
  }

  reviews.reverse().forEach(r => {
    const div = document.createElement('div');
    div.className = 'border p-2 mb-2 rounded bg-light';
    div.innerHTML = `
      <strong>${r.user}</strong>
      <span class="text-warning">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span><br>
      <small class="text-muted">${r.date}</small>
      <p class="mb-0">${r.comment}</p>
    `;
    container.appendChild(div);
  });
}

function setupModalReviewForm(productId) {
  const form = document.getElementById('modalReviewForm');
  const successMsg = document.getElementById('modalReviewSuccess');

  form.onsubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById('modalReviewUser').value.trim();
    const comment = document.getElementById('modalReviewComment').value.trim();
    const rating = document.querySelector('input[name="modalRating"]:checked')?.value;

    if (!user || !comment || !rating) {
      alert('Completa todos los campos.');
      return;
    }

    const review = { user, rating: parseInt(rating), comment, date: new Date().toLocaleDateString() };
    const key = `reviews_product_${productId}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(review);
    localStorage.setItem(key, JSON.stringify(existing));

    form.reset();
    successMsg.style.display = 'block';
    setTimeout(() => successMsg.style.display = 'none', 2000);
    loadModalReviews(productId);
  };
}


function toggleReviewForm(button) {
  const form = button.nextElementSibling;
  form.classList.toggle('d-none');
}

// Inicia los formularios al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.review-form').forEach(formContainer => {
    const productId = formContainer.dataset.productId;
    const form = formContainer.querySelector('form');
    const successMsg = formContainer.querySelector('.review-success');
    const reviewsList = formContainer.querySelector('.reviews-list');

    showReviews(productId, reviewsList);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const user = form.querySelector('.review-user').value.trim();
      const comment = form.querySelector('.review-comment').value.trim();
      const rating = form.querySelector('input[name="rating-' + productId + '"]:checked')?.value;

      if (!user || !comment || !rating) {
        alert('Completa todos los campos.');
        return;
      }

      const review = { user, rating: parseInt(rating), comment, date: new Date().toLocaleDateString() };
      const key = `reviews_product_${productId}`;
      const existing = JSON.parse(localStorage.getItem(key)) || [];
      existing.push(review);
      localStorage.setItem(key, JSON.stringify(existing));

      form.reset();
      successMsg.style.display = 'block';
      setTimeout(() => successMsg.style.display = 'none', 2000);
      showReviews(productId, reviewsList);
    });
  });
});

function showReviews(productId, container) {
  container.innerHTML = '';
  const key = `reviews_product_${productId}`;
  const reviews = JSON.parse(localStorage.getItem(key)) || [];

  if (reviews.length === 0) {
    container.innerHTML = '<p class="text-muted">Aún no hay reseñas.</p>';
    return;
  }

  reviews.reverse().forEach(r => {
    const div = document.createElement('div');
    div.className = 'border p-2 mb-2 rounded bg-light';
    div.innerHTML = `
      <strong>${r.user}</strong>
      <span class="text-warning">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span><br>
      <small class="text-muted">${r.date}</small>
      <p class="mb-0">${r.comment}</p>
    `;
    container.appendChild(div);
  });
}


//función loadReviews fuera del modal
function loadReviews(productId) {
  const list = document.getElementById('reviewsList');
  list.innerHTML = '';
  const reviews = JSON.parse(localStorage.getItem(`reviews_product_${productId}`)) || [];

  if (reviews.length === 0) {
    list.innerHTML = '<p class="text-muted">Aún no hay reseñas.</p>';
    return;
  }

  reviews.reverse().forEach(r => {
    const div = document.createElement('div');
    div.className = 'border p-2 mb-2 rounded bg-light';
    div.innerHTML = `
      <strong>${r.user}</strong> 
      <span class="text-warning">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span><br>
      <small class="text-muted">${r.date}</small>
      <p class="mb-0">${r.comment}</p>
    `;
    list.appendChild(div);
  });
}

//REDIRECCIONAMIENTO DE BOTONES
    document.querySelectorAll('a[href="#about-page"], a[href="#products-page"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const section = document.getElementById(targetId);

            if (section) {
                // Oculta todas las secciones
                document.querySelectorAll('#home-page, #about-page, #products-page').forEach(p => {
                    p.style.display = 'none';
                });

                // Muestra solo la sección correspondiente
                section.style.display = 'block';

                // Scroll hacia la sección
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });



//tema de la pagina
document.addEventListener('DOMContentLoaded', () => {
  // Navegación de páginas
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target && ['#home-page', '#about-page', '#products-page'].includes(targetId)) {
            e.preventDefault();

            // Oculta otras secciones
            document.querySelectorAll('#home-page, #about-page, #products-page').forEach(page => {
                page.style.display = 'none';
            });

            // Muestra la sección deseada
            target.style.display = 'block';

            // Scroll arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Clase activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
        // Si no es una sección válida, no hace nada (como el formulario del footer)
    });
});

document.querySelector('#home-page').style.display = 'block';
document.querySelector('#about-page').style.display = 'none';
document.querySelector('#products-page').style.display = 'none';

  // Theme switcher
    const toggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', currentTheme);
        themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    toggleBtn.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
});
//formulario de la pagina
document.getElementById('footerContactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('footerName').value.trim();
    const email = document.getElementById('footerEmail').value.trim();
    const message = document.getElementById('footerMessage').value.trim();
    if (name && email && message) {
        alert('Gracias por tu mensaje. Te responderemos pronto.');
        this.reset();
    } else {
        alert('Por favor completa todos los campos.');
    }
document.addEventListener('DOMContentLoaded', function () {
    const formSection = document.getElementById('footer-contact');
    const toggleIcon = document.getElementById('toggle-icon');
    const contactLink = document.getElementById('contactToggleLink');

    if (formSection) {
      // Cambia flecha cuando se despliega o se oculta
      formSection.addEventListener('show.bs.collapse', () => {
        toggleIcon.textContent = '▲';
      });

      formSection.addEventListener('hide.bs.collapse', () => {
        toggleIcon.textContent = '▼';
      });

      // Botón del ícono de teléfono del nav
      if (contactLink) {
        contactLink.addEventListener('click', function (e) {
          e.preventDefault(); // evita scroll
            const collapseInstance = bootstrap.Collapse.getOrCreateInstance(formSection);
            if (formSection.classList.contains('show')) {
            collapseInstance.hide();
            } else {
            collapseInstance.show();
            // scroll suave hasta el footer
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    }
  });
});

// CARRITO DE COMPRAS
const cart = [];
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCart();
    });
});

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${item.name} x ${item.quantity} 
            <div>
                <button class="btn btn-sm btn-outline-secondary me-2" onclick="removeItem(${index})">-</button>
                <strong>$${item.price * item.quantity}</strong>
            </div>
        `;
        cartItems.appendChild(li);
    });
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function removeItem(index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

document.getElementById('clear-cart').addEventListener('click', () => {
    cart.length = 0;
    updateCart();
});

document.getElementById('checkout').addEventListener('click', () => {
    alert('Gracias por su compra. Esta es una simulación.');
    cart.length = 0;
    updateCart();
});

document.getElementById('toggle-cart').addEventListener('click', () => {
    const container = document.getElementById('cart-container');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
});

//Volver a registrar los eventos de click para nuevos botones "Agregar al carrito"//
document.getElementById('modalAddToCart')?.addEventListener('click', function () {
    const name = this.dataset.name;
    const price = parseFloat(this.dataset.price);
    const existing = cart.find(item => item.name === name);


    function showCartMessage() {
    const message = document.getElementById('cart-message');
    message.style.display = 'block';
    message.style.opacity = '1';

    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            message.style.display = 'none';
        }, 300);
    }, 2000);
}


    updateCart();
    // se añadio esta linea para mostrar un mensaje como "Tu producto se agregó al carrito"
    showCartMessage();

});





// ========== FUNCIONALIDAD DE FILTROS ========== //
  
  // Función para mostrar/ocultar el filtro
  function toggleFilter() {
      const filter = document.getElementById('filterDropdown');
      const btn = document.querySelector('.filter-btn');
      
      filter.classList.toggle('show');
      btn.classList.toggle('active');
  }
  
  // Cerrar el filtro al hacer clic fuera de él
  document.addEventListener('click', function(event) {
      const filter = document.getElementById('filterDropdown');
      const btn = document.querySelector('.filter-btn');
      
      if (!filter.contains(event.target) && !btn.contains(event.target)) {
          filter.classList.remove('show');
          btn.classList.remove('active');
      }
  });
  
  // Actualizar el valor del rango de precios
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  
  priceRange.addEventListener('input', function() {
      priceValue.textContent = this.value;
  });
  
  // Función para aplicar filtros
  function applyFilters() {
      const maxPrice = parseInt(priceRange.value);
      const selectedCategories = [];
      const showOnlySale = document.querySelector('input[name="sale"]:checked') !== null;
      
      // Obtener categorías seleccionadas
      document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
          selectedCategories.push(checkbox.value);
      });
      
      // Filtrar productos
      const productos = document.querySelectorAll('.producto');
      let visibleCount = 0;
      
      productos.forEach(producto => {
          const price = parseInt(producto.dataset.price);
          const category = producto.dataset.category;
          const isOnSale = producto.dataset.sale === "true";
          
          // Verificar si el producto cumple con los filtros
          const priceMatch = price <= maxPrice;
          const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
          const saleMatch = !showOnlySale || isOnSale;
          
          if (priceMatch && categoryMatch && saleMatch) {
              producto.style.display = 'block';
              visibleCount++;
          } else {
              producto.style.display = 'none';
          }
      });
      
      // Cerrar el filtro
      toggleFilter();
  }
  
  // Función para restablecer filtros
  function resetFilters() {
      // Restablecer controles
      priceRange.value = 5000;
      priceValue.textContent = '5000';
      
      document.querySelectorAll('input[name="category"]').forEach(checkbox => {
          checkbox.checked = true;
      });
      
      document.querySelector('input[name="sale"]').checked = false;
      
      // Mostrar todos los productos
      document.querySelectorAll('.producto').forEach(producto => {
          producto.style.display = 'block';
      });
  }
// Funcion para buscar
function buscar() {
    const inputBusqueda = document.getElementById("busqueda").value.trim().toLowerCase();
    const productos = document.querySelectorAll(".product-card");
    const mensajeVacio = document.getElementById("mensaje-vacio");

    let productosVisibles = 0;

    productos.forEach(producto => {
        const titulo = producto.querySelector(".card-title");
        if (titulo) {
            const textoTitulo = titulo.textContent.trim().toLowerCase();
            const coincide = textoTitulo.includes(inputBusqueda);
            producto.style.display = coincide ? "" : "none";
            if (coincide) productosVisibles++;
        }
    });

    if (productosVisibles === 0) {
        mensajeVacio.style.display = "flex";
        mensajeVacio.classList.add("mostrar");
    } else {
        mensajeVacio.classList.remove("mostrar");
        setTimeout(() => {
            mensajeVacio.style.display = "none";
        }, 300); // Espera que se oculte con animación
    }
}


// Mostrar u ocultar login
function toggleLoginPanel() {
  const panel = document.getElementById('loginPanel');
  const overlay = document.getElementById('loginOverlay');
  panel.classList.toggle('open');
  overlay.classList.toggle('active');
}

// Registro
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('regUsername').value.trim();
  const pass = document.getElementById('regPassword').value.trim();
  if (user && pass) {
    localStorage.setItem(`user_${user}`, pass);
    alert('Usuario registrado correctamente.');
    this.reset();
  }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('loginUsername').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  const stored = localStorage.getItem(`user_${user}`);
  const msg = document.getElementById('welcomeMsg');

  if (stored === pass) {
    msg.textContent = `¡Bienvenido/a, ${user}!`;
    msg.style.display = 'block';
    this.reset();
  } else {
    alert('Usuario o contraseña incorrectos.');
  }
});


