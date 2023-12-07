import {
  CUSTODIAL_WALLET_NAME,
  WATCH_ONLY_WALLET_NAME,
} from "../../bootstrap/seedBitcoinCore";
import { getAddressBalance, transferFunds } from "../util/rpc";

export async function getBalance(req, res) {
  const { BTCAddress } = req.session;
  const balance = await getAddressBalance(WATCH_ONLY_WALLET_NAME, BTCAddress);
  return res.send({ balance });
}

export async function purchaseBTC(req, res) {
  const { BTCAddress } = req.session;
  // TODO: add validation here to make sure plaid balance is greater than amount of BTC being purchased
  const { amount } = req.body;
  try {
    await transferFunds(CUSTODIAL_WALLET_NAME, BTCAddress, amount);
    const balance = await getAddressBalance(WATCH_ONLY_WALLET_NAME, BTCAddress);
    return res.send({ balance });
  } catch (e) {
    const message = e?.response?.data?.error ?? "Unknown error";
    return res.status(500).send({ error: message });
  }
}
