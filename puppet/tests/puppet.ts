// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { Puppet } from "../target/types/puppet";
// const { SystemProgram } = anchor.web3;
// import { expect } from "chai";

// describe("puppet", () => {
//   // Configure the client to use the local cluster.
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);

//   const program = anchor.workspace.Puppet as Program<Puppet>;
//   const puppet = anchor.web3.Keypair.generate();

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.rpc.initialize( new anchor.BN(10),
//     {
//       accounts : {
//         puppet: puppet.publicKey,
//         user: provider.wallet.publicKey,
//         systemProgram: SystemProgram.programId
//       },
//       signers: [puppet]
//     });
//     const data = await program.account.data.fetch(puppet.publicKey);
//     expect(data.data.toNumber()).to.equal(10);
//   });

//   it("is updated", async () => {
//     await program.rpc.setData(new anchor.BN(11), {
//       accounts : {
//         puppet: puppet.publicKey
//       }
//     });
//     const data = await program.account.data.fetch(puppet.publicKey);
//     expect(data.data.toNumber()).to.equal(11);
//   })
// });
