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
    <div id="product-card${id}">
      <img src="${image}" alt="${name} image">
      <div>${name}</div>
      <div>${description}</div>
      <div>De: R$${convertValue(oldPrice)}</div>
      <div><strong>Por: R${convertValue(price)}</strong></div>
      <div>Ou ${installments.count}x de R$${convertValue(installments.value)}</div>
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
