import bip39 from "bip39";
import BIP32Factory from "bip32";
import bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";

const bip32 = BIP32Factory(ecc);

export function generateSeedPhrase() {
  const strength = 128;
  const mnemonic = bip39.generateMnemonic(strength);
  return mnemonic;
}

export async function generateBitcoinAddress(seedPhrase, index) {
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const root = bip32.fromSeed(seed, bitcoin.networks.regtest);
  const path = `m/44'/0'/0'/0/${index}`;
  const child = root.derivePath(path);
  const network = bitcoin.networks.regtest;
  const publicKey = child.publicKey;
  const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey, network });
  return address;
}
