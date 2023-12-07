import { bootstrap } from "../../bootstrap/seedBitcoinCore";

export async function handleBootstrap(req, res) {
  await bootstrap();
  res.send({});
}
