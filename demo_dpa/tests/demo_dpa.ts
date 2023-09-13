import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DemoDpa } from "../target/types/demo_dpa";
const { SystemProgram } = anchor.web3;

describe("demo_dpa", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DemoDpa as Program<DemoDpa>;
  const [account, accountBump] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("seed")],
      program.programId
    );

  it("Is initialized!", async () => {
    // Add your test here.
    await program.rpc.initialize((new anchor.BN(accountBump)).toNumber(), {
      accounts : {
        voteAccount: account,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      }
    });
  });

  it("Update pizza", async ()=> {
    await program.rpc.updatePizza({accounts : {
      voteAccount: account
    }});

    const accountData = await program.account.votingState.fetch(account);
    console.log("Account Data",
    accountData.bump,
    "Pizza" ,
    accountData.pizza.toNumber(),
    "Hamburger ",
    accountData.hamburger.toNumber());
  })

  it("Update hamburger", async ()=> {
    await program.rpc.updateHamburger({accounts : {
      voteAccount: account
    }});

    const accountData = await program.account.votingState.fetch(account);
    console.log("Account Data",
    accountData.bump,
    "Pizza" ,
    accountData.pizza.toNumber(),
    "Hamburger ",
    accountData.hamburger.toNumber());
  })

  it("Update hamburger1", async ()=> {
    await program.rpc.updateHamburger1({accounts : {
      voteAccount: account
    }});

    const accountData = await program.account.votingState.fetch(account);
    console.log("Account Data",
    accountData.bump,
    "Pizza" ,
    accountData.pizza.toNumber(),
    "Hamburger ",
    accountData.hamburger.toNumber());
  })
});

