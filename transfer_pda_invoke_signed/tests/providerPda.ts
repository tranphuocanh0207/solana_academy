import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TransferPdaInvokeSigned } from "../target/types/transfer_pda_invoke_signed";
import { LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";
const { SystemProgram } = anchor.web3;
import { expect } from "chai";

describe("transfer pda sol", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .TransferPdaInvokeSigned as Program<TransferPdaInvokeSigned>;
  let pda;
  let bump;

  const taker = Keypair.generate();

  it("Airdrop to PDA", async () => {
    [pda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("myseed")],
      program.programId
    );
    // let latestBlockHash = await provider.connection.getLatestBlockhash();
    // const signature = await provider.connection.requestAirdrop(
    //   pda,
    //   LAMPORTS_PER_SOL
    // );
    // await provider.connection.confirmTransaction({
    //   blockhash: latestBlockHash.blockhash,
    //   signature: signature,
    //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    // });
    // let balancePda = await provider.connection.getBalance(pda);
    // console.log("balance Pda", balancePda);
    // let balanceTaker = await provider.connection.getBalance(taker.publicKey);
    // console.log("balance Taker", balanceTaker);
  });

  it("Transfer Provider Sol", async () => {
    // Add your test here.
    await program.methods
      .transferProviderSol(new anchor.BN(0.01 * LAMPORTS_PER_SOL), bump)
      .accounts({
        pda: pda,
        taker: taker.publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();
    const balancePda = await provider.connection.getBalance(pda);
    const balanceTaker = await provider.connection.getBalance(taker.publicKey);
    console.log("balance Pda", balancePda);
    console.log("balance Taker", balanceTaker);
  });
});
