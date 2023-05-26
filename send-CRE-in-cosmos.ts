// Successful tx:
// https://www.mintscan.io/cosmos/txs/68874EF62E7FD55A403A15DE7BDE74A3E1FE8F3F145330CEFEC9E275E9F98E1C

import * as dotenv from "dotenv";
dotenv.config();

import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ethers } from "ethers";

const privateKey = process.env.PRIVATE_KEY!;

async function run() {
  const wallet = await DirectSecp256k1Wallet.fromKey(
    ethers.utils.arrayify(privateKey),
    "cosmos"
  );

  const [account] = await wallet.getAccounts();
  console.log("Sender address", account.address);

  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc.cosmos.directory/cosmoshub",
    wallet
  );

  const response = await client.sendTokens(
    account.address,
    "cosmos1anlmc0xkfmmcstjdplfn2ff8s89ra8dj7t35rk",
    [
      {
        denom:
          "ibc/3F18D520CE791A40357D061FAD657CED6B21D023F229EAF131D7FE7CE6F488BD",
        amount: "100",
      },
    ],
    {
      amount: [
        {
          denom: "uatom",
          amount: "3000",
        },
      ],
      gas: "100000",
    }
  );

  console.log(response);
}

run().catch(console.error);
