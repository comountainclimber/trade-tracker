import { createAddress, createWallet, mineBlocks } from "../src/util/rpc";

export const CUSTODIAL_WALLET_NAME = "custodial-wallet";
export const WATCH_ONLY_WALLET_NAME = "watch-only-wallet";

export async function bootstrap() {
  try {
    console.log("Bootstrapping Bitcoin Core....");
    // 1.) Create custodial hot wallet
    await createWallet(CUSTODIAL_WALLET_NAME, {
      load_on_startup: true,
      disable_private_keys: false,
    });
    // 2.) Create address in custodial wallet
    const address = await createAddress(CUSTODIAL_WALLET_NAME);
    // 3.) Mine 1000 blocks to seed the custodial wallet with funds
    console.log("Mining 150 blocks to seed custodial wallet with funds...");
    await mineBlocks(150, address);
    // 4.) Create watch-only wallet for user addresses
    await createWallet(WATCH_ONLY_WALLET_NAME);
  } catch (error) {
    console.error("Error bootstrapping Bitcoin Core:", error);
  }
}
