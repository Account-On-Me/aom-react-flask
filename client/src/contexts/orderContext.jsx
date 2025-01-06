import { createContext, useState } from "react";

export const OrderContext = createContext();

const defaultOrderConstructor = {
  type: "DEFAULT",
  candidateIds: [],
  candidates: [],
  items: [],
  payerId: "",
  payer: null,
}

export const OrderProvider = ({ children }) => {
  const [orderConstructor, setOrderConstructor] = useState(defaultOrderConstructor);
  const [orderPageInfo, setOrderPageInfo] = useState({
    people: [],

  });

  const resetOrderConstructor = () => { 
    setOrderConstructor(defaultOrderConstructor);
  }

  return (
    <OrderContext.Provider value={{
      orderConstructor,
      setOrderConstructor,
      orderPageInfo,
      setOrderPageInfo,
      resetOrderConstructor,
    }}>
      {children}
    </OrderContext.Provider>
  );
};