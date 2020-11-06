const vm = new Vue({
  el: '#app',
  data: {
    productList: [],
    shoopingList: [],
    product: false,
    shopping: false,
    alert: false,
    alertMessage: 'Item was added to shopping list'
  },
  filters: {
    convertMoney(value) {
      return value.toLocaleString(
        'en-US', { style: 'currency', currency: 'USA' });
    }
  }
});
