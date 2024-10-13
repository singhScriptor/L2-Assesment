document.addEventListener("DOMContentLoaded", function() {
    let cart = document.getElementById('cart-content');
    let subtotalElement = document.querySelector("#subtotal");
    let totalElement = document.querySelector("#total");
    let checkoutButton = document.querySelector("#checkout-button");

    fetchCartData();

    function fetchCartData() {
        fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
            .then(response => {
                if (!response.ok) {
                    throw new Error("response err ", response.statusText);
                }
                return response.json();
            })
            .then(data => {
                displayCartItems(data.items);
                calculateTotals(data.items);
                localStorage.setItem('cartData', JSON.stringify(data.items));
            })
            .catch(error => {
                console.error('Error in fetching data:', error);
                loadCartDataFromLocalStorage();
            });
    }

    function loadCartDataFromLocalStorage() {
        let cartData = localStorage.getItem('cartData');
        if (cartData) {
            let items = JSON.parse(cartData);
            displayCartItems(items);
            calculateTotals(items);
        }
    }

    function displayCartItems(items) {
        cart.innerHTML = ''; // Clear existing items
        items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.className = "cart-item flex";
            itemRow.innerHTML = `
                <table>
                    <tr>
                        <td>
                            <div class="product-info">
                                <img src="${item.image}" alt="${item.title}" style="width: 50px; height:50px;">
                                <input type='text' value="${item.title}" readonly>
                            </div>
                        </td>
                        <td><input type="number" value="${item.price / 100}" readonly></td>
                        <td><input type="number" value="${item.quantity}" min="1" class="quantity-input"></td>
                        <td class="subtotal">₹${((item.price / 100) * item.quantity).toFixed(2)}</td>
                        <td><button class="remove-item">🗑️</button></td>
                    </tr>
                </table>
            `;
            cart.appendChild(itemRow);

            itemRow.querySelector('.quantity-input').addEventListener('input', function(event) {
                item.quantity = parseInt(event.target.value);
                updateSubtotal(itemRow, item);
                calculateTotals(items);
                localStorage.setItem('cartData', JSON.stringify(items));
            });

            itemRow.querySelector('.remove-item').addEventListener('click', function() {
                cart.removeChild(itemRow);
                items = items.filter(cartItem => cartItem !== item);
                calculateTotals(items);
                localStorage.setItem('cartData', JSON.stringify(items));
            });
        });
    }

    function updateSubtotal(itemRow, item) {
        const subtotalCell = itemRow.querySelector('.subtotal');
        const subtotal = (item.price / 100) * item.quantity;
        subtotalCell.textContent = `₹${subtotal.toFixed(2)}`;
    }

    function calculateTotals(items) {
        const subtotal = items.reduce((sum, item) => sum + (item.price / 100) * item.quantity, 0);
        const total = subtotal;

        subtotalElement.textContent = `Subtotal: ₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `Total: ₹${total.toFixed(2)}`;
    }


});

//DhirajKr
