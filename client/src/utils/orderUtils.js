export const calculatePaychecks = (itemState, candidateIds) => {
  const methodMeta = itemState.methodMeta;
  const paychecks = [];
  const total = Number.parseFloat(itemState.price * itemState.quantity * (itemState.taxed ? 1 + import.meta.env.VITE_TAX_RATE : 1));
  if (itemState.method === 'EQUAL') {
    candidateIds.forEach(id => {
      paychecks.push({
        candidate: id,
        shouldPay: total / candidateIds.length,
      });
    });
  }
  else if (itemState.method === 'RATIO') {
    let totalRatio = 0;
    candidateIds.forEach(id => {
      totalRatio += Number.parseFloat(methodMeta.ratio[id]);
    });
    console.log(totalRatio);
    candidateIds.forEach(id => {
      paychecks.push({
        candidate: id,
        shouldPay: total * Number.parseFloat(methodMeta.ratio[id]) / totalRatio,
      });
    });
  }
  else if (itemState.method === 'MANUAL') {
    candidateIds.forEach(id => {
      paychecks.push({
        candidate: id,
        shouldPay: Number.parseFloat(methodMeta.manual[id]),
      });
    });
  }
  return paychecks;
}

export const formatOrderForUpload = (orderState) => {
  const order = {};
  // deal with metadata
  order.type = orderState.type;
  order.candidates = orderState.candidateIds;
  order.payer = orderState.payerId;
  // deal with items
  order.items = orderState.items.map(item => {
    const newItem = {};
    newItem.name = item.name;
    newItem.thumbnail = item.thumbnail;
    newItem.type = item.type;
    newItem.method = item.method;
    newItem.price = item.price;
    newItem.quantity = item.quantity;
    newItem.taxed = item.taxed;
    newItem.paychecks = calculatePaychecks(item, orderState.candidateIds);
    return newItem;
  });
  return order;
}

export const getItemsFromWalmertJSON = (wmjson) => {
  const items = wmjson.data.order.groups_2101[0].items;
  const result = items.map(item => {
    const newItem = {};
    newItem.name = item.productInfo.name;
    newItem.thumbnail = item.productInfo.imageInfo.thumbnailUrl;
    newItem.type = 'ITEM';
    newItem.method = 'EQUAL';
    newItem.price = item.priceInfo.linePrice.value / item.quantity;
    newItem.quantity = item.quantity;
    newItem.candidateIds = [];
    newItem.taxed = false;
    newItem.methodMeta = {
      ratio: {},
      manual: {},
    };
    return newItem;
  });
  // add tax if exists
  const taxInfo = wmjson.data.order.priceDetails.taxTotal.value;
  if (taxInfo > 0) {
    const taxItem = {
      name: 'Tax',
      type: 'TAX',
      method: 'EQUAL',
      price: taxInfo,
      quantity: 1,
      candidateIds: [],
      taxed: false,
      methodMeta: {
        ratio: {},
        manual: {},
      },
    }
    result.push(taxItem);
  }
  return result;
}