import { create } from "zustand";
import { makeInternalRequest } from "../util/api";

export const useCryptoStore = create((set, get) => ({
  BTCAddress: "",
  BTCPrice: 0,
  BTCBalance: 0,
  purchaseBitcoin: async (amount) => {
    try {
      const { data, status } = await makeInternalRequest(
        "purchase-btc",
        "POST",
        {
          amount,
        }
      );
      if (status !== 200) throw new Error(data.error.message);
      get().getBitcoinBalance();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getBitcoinBalance: async () => {
    const { data } = await makeInternalRequest("get-address-balance", "GET");
    const amounts = data?.balance?.map(({ amount }) => amount) ?? [];

    let balance = 0;
    for (const amount of amounts) {
      balance += amount;
    }
    set({ BTCBalance: balance.toFixed(8) });
  },
  getCurrentBitcoinPrice: async () => {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD"
    );
    const data = await response.json();
    set({ BTCPrice: data.USD });
  },
  update: (data) => {
    set(data);
  },
}));
