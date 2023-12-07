import { create } from "zustand";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { usePlaidStore } from "./plaid";
import { useCryptoStore } from "./crypto";
import { makeInternalRequest } from "../util/api";

function resetState() {
  const { update: setCryptoStore } = useCryptoStore.getState();
  const { update: setPlaidStore } = usePlaidStore.getState();
  const { update: setAuthStore } = useAuthStore.getState();
  setAuthStore({
    loading: false,
    authenticated: false,
  });
  setCryptoStore({
    BTCAddress: "",
    BTCBalance: 0,
    BTCPrice: 0,
  });
  setPlaidStore({
    plaidAccounts: [],
    link_token: "",
  });
}

export const useAuthStore = create((set, get) => ({
  authenticated: false,
  loading: false,
  checkAuthStatus: async () => {
    const { getBitcoinBalance, update: setCryptoStore } =
      useCryptoStore.getState();
    const { update: setPlaidStore } = usePlaidStore.getState();
    try {
      set({ loading: true });
      const { data } = await makeInternalRequest("check-auth-status", "GET");
      if (data.authenticated) {
        getBitcoinBalance();
        setCryptoStore({
          BTCAddress: data.address,
        });
        setPlaidStore({
          plaidAccounts: data?.plaidAccounts ?? [],
          link_token: data.link_token,
        });
        return set({
          authenticated: true,
          loading: false,
        });
      }
      resetState();
    } catch (error) {
      resetState();
      console.log(error);
    }
  },
  createNewAccount: async (account) => {
    try {
      const { data } = await makeInternalRequest(
        "generate-registration-options",
        "POST",
        account
      );
      const registrationResponse = await startRegistration(data);
      const { status } = await makeInternalRequest(
        "verify-registration",
        "POST",
        registrationResponse
      );
      if (status !== 200) throw new Error("Invalid registration");
      get().checkAuthStatus();
    } catch (error) {
      console.log(error);
    }
  },
  authenticate: async (shouldCheckAuthStatus = true) => {
    try {
      const { data: options } = await makeInternalRequest(
        "generate-authentication-options",
        "GET"
      );
      const authResponse = await startAuthentication(options);
      const { status } = await makeInternalRequest(
        "verify-authentication",
        "POST",
        authResponse
      );
      if (status !== 200) {
        throw new Error("Invalid credentials");
      }
      shouldCheckAuthStatus && get().checkAuthStatus();
    } catch (error) {
      resetState();
      console.log(error);
    }
  },
  logout: async () => {
    try {
      await makeInternalRequest("logout", "GET");
      get().checkAuthStatus();
    } catch (error) {
      console.log(error);
    }
  },
  update: (data) => {
    set(data);
  },
}));
