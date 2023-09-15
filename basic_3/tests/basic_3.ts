import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Basic3 } from "../target/types/basic_3";
import { expect } from "chai";

describe("basic_3", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const user = await anchor.web3.Keypair.generate();

  const program = anchor.workspace.Basic3 as Program<Basic3>;
  const [userStatsPDA, bump] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [dataPDA, bump2] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("data"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

  console.log(userStatsPDA, bump, dataPDA, bump2);

  it("is set and change name", async () => {
    // Add your test here.

    // const tx = await program.rpc.createUserStats(
    //   'alan',
    //   { accounts: {
    //     user: provider.wallet.publicKey,
    //     userStats: userStatsPDA,
    //     systemProgram: anchor.web3.SystemProgram.programId
    //   }}
    // );
    const data = await program.account.userStats.fetch(userStatsPDA);
    expect(data.name).to.equal("Alan Tran");

    await program.rpc.changeName('Alan Tran', {
      accounts: {
        userStats: userStatsPDA
      }
    });
    const dataAfter = await program.account.userStats.fetch(userStatsPDA);
    expect(dataAfter.name).to.equal('Alan Tran');
    console.log(1);
    await program.rpc.createData( new anchor.BN(10), {
      accounts: {
        user: provider.wallet.publicKey,
        dataAccount: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [user]
    })

    const dataNew = await program.account.data.fetch(user.publicKey);
    console.log(dataNew);
  });
});
