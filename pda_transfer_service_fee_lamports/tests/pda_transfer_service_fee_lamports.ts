import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaTransferServiceFeeLamports } from "../target/types/pda_transfer_service_fee_lamports";
const { SystemProgram } = anchor.web3;
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("pda_transfer_service_fee_lamports", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .PdaTransferServiceFeeLamports as Program<PdaTransferServiceFeeLamports>;
  let _pda;
  const encode = anchor.utils.bytes.utf8.encode;
  const connection = program.provider.connection;

  it("Is initialized!", async () => {
    // Add your test here.
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [encode("pda")],
      program.programId
    );
    // const tx = await program.methods.initialize().accounts({
    //   authority: provider.wallet.publicKey,
    //   pda: pda,
    //   systemProgram: SystemProgram.programId
    // }).rpc();
    const balanceBefore = await provider.connection.getBalance(pda);
    console.log("Pda balance before:", balanceBefore);
    _pda = pda;
  });

  it("Deposit to PDA", async () => {
    const providerBalanceBefore = await provider.connection.getBalance(provider.wallet.publicKey);
    console.log("Provider balance before:", providerBalanceBefore);
    const pda = _pda;
    const user = anchor.web3.Keypair.generate();
    const tx = await program.methods.deposit(
      new anchor.BN(0.001 * LAMPORTS_PER_SOL)
    ).accounts({
      wallet: provider.wallet.publicKey,
      pda: pda,
      systemProgram: SystemProgram.programId,
    }).rpc();
    const providerBalance= await provider.connection.getBalance(provider.wallet.publicKey);
    console.log("Provider balance:", providerBalance);
 
    const balance = await provider.connection.getBalance(pda);
    console.log("Pda balance:", balance);
  });

  it("Withdraw from PDA", async ()=> {
    const pda = _pda;
    const tx = await program.methods.withdraw(new anchor.BN(0.001 * LAMPORTS_PER_SOL)).accounts({pda: pda,
    wallet: provider.wallet.publicKey,
    authority: provider.wallet.publicKey}).rpc();
      const balance = await provider.connection.getBalance(pda);
      console.log('balance of pda =>', balance);

  })
});
