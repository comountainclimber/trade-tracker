import axios from "axios";

const rpcUser = "test";
const rpcPassword = "test";
const rpcUrl = "http://127.0.0.1:8337";

export async function transferFunds(walletName, toAddress, amount) {
  const requestData = {
    jsonrpc: "1.0",
    id: "curltest",
    method: "sendtoaddress",
    params: [toAddress, amount],
  };

  try {
    const response = await axios({
      method: "post",
      url: `${rpcUrl}/wallet/${walletName}`,
      data: requestData,
      auth: {
        username: rpcUser,
        password: rpcPassword,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });
    console.log("Funds Transferred:", response.data.result);
  } catch (error) {
    console.error("Error transferring funds:", error.response.data.error);
    throw error;
  }
}

export async function createAddress(walletName) {
  const requestData = {
    jsonrpc: "1.0",
    id: "curltest",
    method: "getnewaddress",
    params: [],
  };

  try {
    const response = await axios({
      method: "post",
      url: `${rpcUrl}/wallet/${walletName}`,
      data: requestData,
      auth: {
        username: rpcUser,
        password: rpcPassword,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("Address Created:", response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error creating bitcoin address:", error.response.data.error);
  }
}

export async function mineBlocks(numBlocks, toAddress) {
  const requestData = {
    jsonrpc: "1.0",
    id: "curltest",
    method: "generatetoaddress",
    params: [numBlocks, toAddress],
  };

  try {
    const response = await axios({
      method: "post",
      url: rpcUrl,
      data: requestData,
      auth: {
        username: rpcUser,
        password: rpcPassword,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("Blocks Mined:", response.data.result);
  } catch (error) {
    console.error("Error mining blocks:", error.response.data.error);
  }
}

export async function createWallet(
  wallet_name,
  params = {
    avoid_reuse: false,
    descriptors: false,
    load_on_startup: false,
    disable_private_keys: true,
  }
) {
  const createWalletRequest = {
    jsonrpc: "1.0",
    id: "curltest",
    method: "createwallet",
    params: {
      wallet_name,
      // eslint-disable-next-line
      ...params,
    },
  };

  try {
    const response = await axios({
      method: "post",
      url: rpcUrl,
      data: createWalletRequest,
      auth: {
        username: rpcUser,
        password: rpcPassword,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("Wallet Created:", response.data.result.name);
  } catch (error) {
    console.error("Error creating wallet:", error.response.data.error);
  }
}

export async function importAddress(address, walletName) {
  const requestData = {
    jsonrpc: "1.0",
    id: "curltest",
    method: "importaddress",
    params: [address, "", false],
  };

  try {
    await loadWallet(walletName);
    await axios({
      method: "post",
      url: `${rpcUrl}/wallet/${walletName}`,
      data: requestData,
      auth: {
        username: rpcUser,
        password: rpcPassword,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("Address Imported:", address);
  } catch (error) {
    console.log;
    console.error(
      "Error importing bitcoin address:",
      error.response.data.error
    );
  }
}

export async function loadWallet(walletName) {
  const loadWalletRequest = {
    jsonrpc: "1.0",
    id: "curltest",
    method: "loadwallet",
    params: [walletName],
  };

  try {
    const response = await axios({
      method: "post",
      url: rpcUrl,
      data: loadWalletRequest,
      auth: {
        username: rpcUser,
        password: rpcPassword,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("Wallet Loaded:", response.data.result);
  } catch (error) {
    console.error("Error loading wallet:", error.response.data.error);
  }
}

export async function getAddressBalance(walletName, address) {
  const requestData = {
    jsonrpc: "1.0",
    id: "curltest",
    method: "listunspent",
    params: [0, 9999999, [address]],
  };

  try {
    const response = await axios({
      method: "post",
      url: `${rpcUrl}/wallet/${walletName}`,
      data: requestData,
      auth: {
        username: rpcUser,
        password: rpcPassword,
      },
      headers: {
        "Content-Type": "text/plain",
      },
    });

    console.log("Address Balance:", response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error getting address balance:", error.response.data.error);
  }
}
