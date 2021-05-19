async function atcAjax (args, onSuccess = () => {/* callback for UI effects on success */}, onError = (errorDescription) => {}) {
    let result

    try {
        result = await $.ajax({
            type: 'POST',
            async: true,
            url: '/cart/add.js',
            dataType: 'json',
            data: args,
            success: function (cart) {
                console.log("success", cart)
                onSuccess(cart)
            },
            complete: function (response) {
                console.log("complete", response)
                //window.location.href = '/cart';
            },
            error: function (response) {
                console.log("error", response)
                onError(response.responseJSON.description)
            }
        })

        return result
    } catch (error) {
        console.error(error)
    }
}
window.atcAjax = atcAjax;


async function updateCartIconAjax (n) {
    const cartItemCounts = [
      $('#header-nav-cart-item-count'),
      $('#mobile-nav-cart-item-count')
    ]
    const setItemCounts = (k) => cartItemCounts.forEach($x => $x.text(`${k}`))

    if (n) {
      setItemCounts(n)
    } else {
      $.get(
        "/cart.js",
        ( data ) => {
          const cart = JSON.parse(data)
          if (Object.keys(cart).includes('item_count')) {
            setItemCounts(cart.item_count)
          }
        }
      );
    }
}
window.updateCartIconAjax = updateCartIconAjax