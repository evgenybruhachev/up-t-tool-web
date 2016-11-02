import { HOST, session } from '../constants';

export const getCategories = () => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/categories?session=${session}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.categories)))
    .catch(err => reject(err));
  });
};

export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products?session=${session}&category_id=${categoryId}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data.products)))
    .catch(err => reject(err));
  });
};

export const getProduct = (productId) => {
  return new Promise((resolve, reject) => {
    fetch(`${HOST}/products/product?session=${session}&product_id=${productId}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then(response => response.json().then(data => resolve(data)))
    .catch(err => reject(err));
  });
};
