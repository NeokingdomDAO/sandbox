// successful tx:
// https://www.mintscan.io/cosmos/txs/14CBD83DDCC8301207637A3337C397ACA925B461A5FA98E129B111B7E6732CBA?height=15457189

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
    "cosmos"
  );

  const [account] = await wallet.getAccounts();
  console.log("Sender address", account.address);

  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc.cosmos.directory/cosmoshub",
    wallet
  );

  const response = await client.sendIbcTokens(
    account.address,
    "cre1ch39lpfhz25srsmq7fnhcvnnv94fcfprwjz2vs",
    {
      denom:
        "ibc/3F18D520CE791A40357D061FAD657CED6B21D023F229EAF131D7FE7CE6F488BD",
      amount: "100000",
    },
    "transfer",
    "channel-326",
    { revisionNumber: new Long(1), revisionHeight: new Long(6700000) },
    undefined,
    {
      amount: [
        {
          denom: "uatom",
          amount: "25000",
        },
      ],
      gas: "200000",
    }
  );

  console.log(response);
}

run().catch(console.error);
