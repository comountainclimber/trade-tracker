import { create } from "zustand";
import { makeInternalRequest } from "../util/api";

export const usePlaidStore = create((set) => ({
  plaidAccounts: [],
  loading: false,
  link_token: "",
  getPlaidAccounts: async (public_token) => {
    set({ loading: true });
    await makeInternalRequest("get-plaid-access-token", "POST", {
      public_token,
    });
    const {
      data: { accounts },
    } = await makeInternalRequest("get-plaid-accounts", "GET");
    set({ plaidAccounts: accounts, loading: false });
  },
  update: (data) => {
    set(data);
  },
}));
