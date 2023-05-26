import * as dotenv from "dotenv";
dotenv.config();

import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ethers } from "ethers";
import { Long } from "cosmjs-types/helpers";

const privateKey = process.env.PRIVATE_KEY!;

async function run() {
  const wallet = await DirectSecp256k1Wallet.fromKey(
    ethers.utils.arrayify(privateKey),
    "evmos"
  );

  const [account] = await wallet.getAccounts();
  console.log("Sender address", account.address);

  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc.cosmos.directory/evmos",
    wallet
  );

  const response = await client.sendIbcTokens(
    account.address,
    "cre1ch39lpfhz25srsmq7fnhcvnnv94fcfprwjz2vs",
    {
      denom: "erc20/0x655ecB57432CC1370f65e5dc2309588b71b473A9",
      amount: "100000",
    },
    "transfer",
    "channel-11",
    { revisionNumber: new Long(1), revisionHeight: new Long(6700000) },
    undefined,
    {
      amount: [
        {
          denom: "aevmos",
          amount: "10000000",
        },
      ],
      gas: "200000",
    }
  );

  console.log(response);
}

run().catch(console.error);
