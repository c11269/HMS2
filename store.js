
// Check to make sure the html is loaded before the javascript runs by adding a listener.
if(document.redyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}

function ready(){

///////////////  Menu javascript
    // fetching the menu ID from above html class.
    var menu = document.getElementById('menu');
    var nav = document.getElementById('nav');
    var exit = document.getElementById('exit');

    // Now we add effects when the event is triggered.
    menu.addEventListener('click', function(e){
        //alert('I have been clicked');
        // our function will toggle hide-mobile, which will show the menu on clicking hamburger icon.
        //We prevent default to prevent browser from scrolling to the top when you click hamburger.
        // function 'e' is passed in above when we define it.
        nav.classList.toggle('hide-mobile');
        e.preventDefault;
    })

    // Now we add 'hide-mobile' when we click the exit button.
    exit.addEventListener('click', function(e){
        nav.classList.add('hide-mobile');
        e.preventDefault;
    })


    ///////////////  Store/Cart javascript
    // Grab a list of all btn-red class items in document
    var removeCartItemButtons = document.getElementsByClassName('btn-red');
    // console.log(removeCartItemButtons) 

    // for each button on the page with btn-red class, listen for click event, and on event remove the row.
    for (var i=0; i < removeCartItemButtons.length; i++){
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    // Get the quantity of each item in cart, and monitor for changes, then call function
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for(var i=0; i< quantityInputs.length; i++){
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    // Add to cart button press
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    //When purhcase button clicked, call function
    document.getElementsByClassName('btn-cart-purchase')[0].addEventListener('click',purchaseClicked)
}

//When purhcase button clicked, 
function purchaseClicked(){
    var total = document.getElementsByClassName('cart-total-price')[0].innerText
    alert('Thank you for your purchase totalling ' + total)
    //remove all items from cart
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
updateCartTotal()
}

// Add to cart logic, on button press add the title, image, price. Quantity always 1, remove button always the same.
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

//on remove button press event, remove the row from cart and update total.
function removeCartItem(event){
                // event object has property target, which specifies the button clicked. 
                var buttonClicked = event.target
                // So we want to go up 2 parent elements (classes) and remove the row when 'remove' button is clicked.
                buttonClicked.parentElement.parentElement.remove()
                updateCartTotal()
}

// receive quantity element from event target. check if valid value, otherwise set to 1.  then call update total fucntion.
function quantityChanged(event){
    var input = event.target
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1
    } 
    updateCartTotal()
}

//Pass in title, image, price elements. Check if item is a duplicate entry, and if so throw an error.
//If not, create a div element in html, populate it with elements passed in, quantity 1, remove button.
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-red" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-red')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

// Function to update cart total by grabbing price and quantity values, then subtracting from total.
function updateCartTotal(){
    // grab the first cart-items element (expect only 1), then grab its rows (all items in cart).
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0

    // for each row (each item in cart), get the price and quantity (expect only 1).
    for (var i=0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]

        // now get the actual text from the elements. remove '$' text and convert to a float to make it a number.
        var price = parseFloat(priceElement.innerText.replace('$',''))
        var quantity = quantityElement.value
        total = total +(price*quantity)
    }
    // round off float decimals.
    total = Math.round(total *100)/100
    // Set the total text to be equal to the total calculated previously.
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}