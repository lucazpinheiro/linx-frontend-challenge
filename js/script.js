const INITIAL_ENDPOINT = 'https://frontend-intern-challenge-api.iurykrieger.now.sh/products?page=1';
const productElement = document.getElementById('products');
const products = [];
let currentEndpoint = '';
let producCards = '';

async function getProducts(apiEndpoint) {
  try {
    const response = await fetch(apiEndpoint, { method: 'Get' });
    return await response.json();
  } catch (err) {
    // do something with error
  }
}

function convertValueToReal(value) {
  return value.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

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

function getAllCards(builder, productsList, valueConverter) {
  return productsList.map((product) => builder(product, valueConverter));
}


function addElementToPage(domElement, htmlComponent) {
  domElement.innerHTML = htmlComponent;
}

function addMoreProcuts() {
  getProducts(currentEndpoint).then((data) => {
    products.push(...data.products);
    currentEndpoint = `https://${data.nextPage}`;

    const productCards = getAllCards(buildCard, products, convertValueToReal);
    addElementToPage(productElement, productCards.join(''));
  })
}

(async () => {
  const data = await getProducts(INITIAL_ENDPOINT);
  products.push(...data.products);
  currentEndpoint = `https://${data.nextPage}`;
  
  const productCards = getAllCards(buildCard, products, convertValueToReal);
  addElementToPage(productElement, productCards.join(''));
})();
