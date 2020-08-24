/**
 * Initial API end point.
 */
const INITIAL_ENDPOINT = 'https://frontend-intern-challenge-api.iurykrieger.now.sh/products?page=1';
/**
 * Page node to update.
 */
const productElement = document.getElementById('products');
/**
 * Array that receives the products data.
 */
const products = [];
/**
 * String to be updated with the new API end point.
 */
let currentEndpoint = '';

/**
 * Calls API and return a promise with next end point and products array.
 * @param  {String} apiEndpoint API endpoint to be called
 * @return {Promise}            Promise to be resolved where function were called
 */
async function getProducts(apiEndpoint) {
  try {
    const response = await fetch(apiEndpoint, { method: 'Get' });
    return await response.json();
  } catch (err) {
    return err
  }
}

/**
 * Format value string to value in the local currency
 * @param  {Number} value Some value propertie from product object
 * @return {String}       Value converted to local currency string
 */
function convertValueToReal(value) {
  return value.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

/**
 * Generete html component card with properties from product object.
 * @param  {Object} product Object with properties for product
 * @return {String}         String of html component builted with product properties
 */
function buildCard(product, convertValue) {
  const {
    id,
    name,
    image,
    oldPrice,
    price,
    description,
    installments,
  } = product;

  return`
    <div class="product-card" id="product-card${id}">
      <img src="${image}" alt="${name} image">
      <div class="product-name">${name}</div>
      <div class="product-description">${description}</div>
      <div class="product-price">De: R$${convertValue(oldPrice)}</div>
      <div class="product-oldPrice"><strong>Por: R${convertValue(price)}</strong></div>
      <div class="product-installments">Ou ${installments.count}x de R$${convertValue(installments.value)}</div>
      <button class="buy-product-button">Comprar</button>
    </div>
  `;
}

/**
 * Return array from a map function on array of products, each element of the returned arrays is a html component.
 * @param  {Function} builder        Function callback that returns a string from a object parameter
 * @param  {Array}    productsList   Array of products objects
 * @param  {Function} valueConverter Function callback that returns string converted to local currency 
 * @return {Array}                   String of html components builted with product properties
 */
function getAllCards(builder, productsList, valueConverter) {
  return productsList.map((product) => builder(product, valueConverter));
}

/**
 * Update page by adding html string to dom.
 * @param  {Node}   domElement    Reference to html element
 * @param  {String} htmlComponent String of html component to be added to the page   
 */
function addElementToPage(domElement, htmlComponent) {
  domElement.innerHTML = htmlComponent;
}

/**
 * Warnes user that some error happend during products data fetching.
 */
function handleError() { 
  alert('Não foi possível carregar seus produtos. Por favor, tente novamente mais tarde.');
}

/**
 * Update page by adding html string to the dom.
 */
function addMoreProcuts() {
  getProducts(currentEndpoint).then((data) => {
    products.push(...data.products);
    currentEndpoint = `https://${data.nextPage}`;

    const productCards = getAllCards(buildCard, products, convertValueToReal);
    addElementToPage(productElement, productCards.join(''));
  }).catch((err) => {
    console.log(err);
    handleError();
  });
}

/**
 * Call function to get data from api, updates 'products' and 'currentEndpoint' variables, calls 'getAllCards' and 'addElementToPage' functions, when page is loaded.
 */
(async () => {
  try {
    const data = await getProducts(INITIAL_ENDPOINT);
    products.push(...data.products);
    currentEndpoint = `https://${data.nextPage}`;

    console.log(data.products);
    
    const productCards = getAllCards(buildCard, products, convertValueToReal);
    addElementToPage(productElement, productCards.join(''));
  } catch (err){
    console.log(err);
    handleError();
  }
})();
