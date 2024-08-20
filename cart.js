document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const cartLink = document.querySelector('.nav-link[href="cart.html"]');
    const cartItemsContainer = document.getElementById('cart-items');
    let cart = {};

    // Fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Render products
    function renderProducts(products) {
        productList.innerHTML = ''; // Clear any previous content

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-3 product-card';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <div class="card-body">
                    <h5>${product.title}</h5>
                    <p>${product.description.slice(0, 100)}...</p>
                    <div class="price">$${product.price}</div>
                    <button>Add to Cart</button>
                </div>
            `;

            const addButton = productCard.querySelector('button');
            addButton.addEventListener('click', () => {
                addToCart(product);
            });

            productList.appendChild(productCard);
        });
    }

    // Add item to cart
    function addToCart(product) {
        if (cart[product.id]) {
            cart[product.id].quantity++;
        } else {
            cart[product.id] = {
                ...product,
                quantity: 1
            };
        }
        updateCartCount();
        renderCartItems();
    }

    // Remove item from cart
    function removeFromCart(productId) {
        if (cart[productId]) {
            cart[productId].quantity--;
            if (cart[productId].quantity === 0) {
                delete cart[productId];
            }
        }
        updateCartCount();
        renderCartItems();
    }

    // Update the cart count
    function updateCartCount() {
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        cartLink.innerHTML = `<i class="fa fa-shopping-cart"></i> Cart (${totalItems})`;
    }

    // Render cart items in the modal
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear any previous content

        Object.values(cart).forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.className = 'list-group-item d-flex justify-content-between align-items-center';

            cartItem.innerHTML = `
                <span>${item.title} x ${item.quantity}</span>
                <div>
                    <button class="btn btn-sm btn-danger">Remove</button>
                </div>
            `;

            const removeButton = cartItem.querySelector('button');
            removeButton.addEventListener('click', () => {
                removeFromCart(item.id);
            });

            cartItemsContainer.appendChild(cartItem);
        });
    }

    // Initialize the product display
    const products = await fetchProducts();
    renderProducts(products);
});
