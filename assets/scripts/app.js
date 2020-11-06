const vm = new Vue({
  el: '#app',
  data: {
    productList: [],
    shoopingList: [],
    product: false,
    shopping: false,
    alertOn: false,
    alertMessage: 'Item was added to shopping list'
  },
  filters: {
    convertMoney(value) {
      return value.toLocaleString(
        'en-US', { style: 'currency', currency: 'USA' });
    }
  },
  computed: {
    cartTotal() {
      let total = 0;
      if (this.shoppingList.length)
        this.shoppingList.forEach(item => { total += item.price; });
      return total;
    }
  },
  methods: {
    getProductList() {
      fetch('./api/index.json')
      .then(response => response.json())
      .then(response => { this.productList = response; });
    },
    getProduct(id) {
      fetch(`./api/products/${id}/data.json`)
      .then(response => response.json())
      .then(response => { this.product = response; });
    },
    openModal(id) {
      this.getProduct(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    closeModal({ target, currentTarget }) {
      if (target === currentTarget) this.product = false;
    },
    clickOutCart({ target, currentTarget }) {
      if (target === currentTarget) this.shopping = false;
    },
    addShoppingItem() {
      this.product.stock--;
      const { id, name, price } = this.product;
      this.shoppingList.push({ id, name, price });
      this.alert(`${name} was added to shopping cart`);
    },
    removeShoppingItem(index) {
      this.shoppingList.splice(index, 1);
    },
    checkLocalStorage() {
      if (localStorage.shoppingList)
        this.shoppingList = JSON.parse(localStorage.shoppingList);
    },
    compareStock() {
      const items = this.shoppingList.filter(
        ({ id }) => id === this.product.id);
      this.product.stock -= items.length;
    },
    alert(message) {
      this.alertMessage = message;
      this.altertOn = true;
      setTimeout(() => { this.alertOn = false; }, 1500);
    },
    router() {
      const hash = document.location.hash;
      if (hash) this.getProduct(hash.replace('#', ''));
    }
  },
  watch: {
    product() {
      document.title = this.product.name || 'YSTORE';
      const hash = this.product.id || '';
      history.pushState(null, null, `#${hash}`);
      if (this.product) this.compareStock();
    },
    shoppingList() {
      localStorage.shoppingList = JSON.stringify(this.shoppingList);
    }
  },
  created() {
    this.getProductList();
    this.router();
    this.checkLocalStorage();
  }
});
