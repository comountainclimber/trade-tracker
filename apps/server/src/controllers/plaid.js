import { MOCK_DATABASE } from "../database";
import { plaidClient } from "../util/plaid";

export async function createPlaidLinkToken() {
  const results = await plaidClient
    .linkTokenCreate({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      client_name: "Plaid Quickstart",
      country_codes: ["US"],
      language: "en",
      user: {
        client_user_id: "unique-per-user",
      },
      products: ["auth"],
    })
    .catch((e) => {
      console.log({ e });
    });

  return results?.data ?? { link_token: "" };
}

export async function getPlaidAccounts(access_token) {
  const { data } = await plaidClient.accountsGet({
    access_token,
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
  });

  return data.accounts;
}

export async function handleGetPlaidAccounts(req, res) {
  const { userId } = req.session;
  const user = MOCK_DATABASE[userId];
  const accounts = await getPlaidAccounts(user.plaidAccessToken).catch((e) => {
    console.log({ e });
    return res.status(500).send({ error: "Unknown error" });
  });
  req.session.plaidAccounts = accounts;
  return res.send({ accounts });
}

export async function getPlaidAccessToken(req, res) {
  const { public_token } = req.body;
  const response = await plaidClient
    .itemPublicTokenExchange({
      public_token,
    })
    .catch((e) => {
      console.log({ e });
      return res.status(500).send({ error: "Unknown error" });
    });

  const user = MOCK_DATABASE[req.session.userId];
  user.plaidAccessToken = response?.access_token;
  res.send({});
}
