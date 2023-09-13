import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AccountData } from "../target/types/account_data";
const {SystemProgram} = anchor.web3;
describe("account_data", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const myAccount =  anchor.web3.Keypair.generate();

  const program = anchor.workspace.AccountData as Program<AccountData>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize(new anchor.BN(10),
    {
      accounts: {
        myAccount: myAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [myAccount]
    });
    console.log("Your transaction signature", tx);
    
    const data = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log("My Account data", data.data.toNumber());
  });

  it("Is Updated!", async ()=> {
    await program.rpc.update(new anchor.BN(10), {
      accounts: {
        myAccount: myAccount.publicKey
      }
    })
    const data = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log("After updated", data.data.toNumber());
  })
});
