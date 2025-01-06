import { GET, POST, DELETE } from './axios';

export const fetchOrder = (id) => { 
  return GET(`/order/${id}`);
}

export const fetchOrderRichList = () => { 
  return GET('/order/list');
}

export const fetchOrderAbsList = () => { 
  return GET('/order/abslist');
}

export const createOrder = (data) => { 
  return POST('/order/create', data);
}

export const deleteOrder = (id, auth) => { 
  return DELETE(`/order/${id}`, {}, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth,
    },
  });
}