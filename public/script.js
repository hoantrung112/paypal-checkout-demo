const checkoutBtn = document.querySelector("#checkout-btn");
const paypalWrapper = document.querySelector("#paypal-wrapper");
const addToCartBtn = document.querySelector("#add-to-cart-btn");
const cancelBtn = document.querySelector("#cancel-btn");
let cart = [];

addToCartBtn.addEventListener("click", () => {
  const input = document.querySelectorAll(".input-quantity");
  let itemCount = 0;
  // clear cart
  cart.splice(0, cart.length);
  // add to cart
  input.forEach((e, id) => {
    if (!isNaN(parseInt(e.value))) {
      cart.push({
        id: id,
        quantity: e.value,
      });
      itemCount += parseInt(e.value);
    }
  });
  if (itemCount > 0) {
    checkoutBtn.disabled = false;
    cancelBtn.disabled = false;
    alert(`${itemCount} items have been successfully added to your cart!`);
  } else {
    alert("No item added to cart! Cannot proceed to checkout!");
  }
});

checkoutBtn.addEventListener("click", () => {
  paypalWrapper.style.display = "block";
  window.scrollTo(0, document.body.scrollHeight);
});

cancelBtn.addEventListener("click", () => {
  // clear cart
  cart.splice(0, cart.length);

  // disable buttons
  // checkoutBtn.disabled = true;
  // cancelBtn.disabled = true;
  // // hide paypal checkout
  // paypalWrapper.setAttribute("display", "none !important");
  alert("Cart cleared successfully!");
  location.reload();
});

paypal
  .Buttons({
    createOrder: function () {
      return fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart
        }),
      })
        .then(res => {
          if (res.ok) return res.json()
          return res.json().then(json => Promise.reject(json))
        })
        .then(({ id }) => {
          return id
        })
        .catch(e => {
          console.error(e.error)
        })
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (orderData) {
        alert("Transaction successfully executed!\nWallet owner : " + orderData.payer.name.given_name);

        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        const transaction = orderData.purchase_units[0].payments.captures[0];
        alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);

      })
    },
  })
  .render("#paypal")
