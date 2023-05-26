import * as dotenv from "dotenv";
dotenv.config();

import {
  LCDClient,
  MnemonicKey,
  MsgTransfer,
  Coin,
} from "@terra-money/feather.js";

async function main() {
  const lcd = new LCDClient({
    // key must be the chainID
    "evmos_9001-2": {
      lcd: "https://evmos-lcd.stakely.io",
      chainID: "evmos_9001-2",
      prefix: "evmos",
    },
  });

  const mk = new MnemonicKey({
    mnemonic: process.env.MNEMONIC!,
  });

  console.log(mk.accAddress("evmos"));

  const wallet = lcd.wallet(mk);

  const transfer = new MsgTransfer(
    "transfer",
    "channel-11",
    new Coin("aneok", "100000000000000000"),
    "evmos13ew4v092n8ch4v8cjc8jnr2ct86rsgels7k4hf",
    "osmo1cl4qw7u35uf77l4scjtv0qej8ycevu4mrdpvmg",
    undefined,
    (Date.now() + 60 * 1000) * 1e6
  );

  console.log(transfer);

  const tx = await wallet.createAndSignTx({
    msgs: [transfer],
    chainID: "evmos_9001-2",
  });

  console.log(tx);

  const result = await lcd.tx.broadcast(tx, "evmos_9001-2");

  console.log(result);
}

main().catch(console.error);
