import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Puppet } from "../target/types/puppet";
import { PuppetMaster } from "../target/types/puppet_master";
const { SystemProgram } = anchor.web3;
import { expect, assert } from "chai";
import { AnchorError } from "@coral-xyz/anchor";

describe("puppet", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Puppet as Program<Puppet>;
  const program_master = anchor.workspace.PuppetMaster as Program<PuppetMaster>;
  const puppet = anchor.web3.Keypair.generate();
  const authority = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize(
      new anchor.BN(10),
      authority.publicKey,
      {
        accounts: {
          puppet: puppet.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [puppet],
      }
    );
    const data = await program.account.data.fetch(puppet.publicKey);
    expect(data.data.toNumber()).to.equal(10);
  });

  it("is pull string", async () => {
    await program_master.rpc.pullString(new anchor.BN(12), {
      accounts: {
        puppet: puppet.publicKey,
        puppetProgram: program.programId,
        authority: authority.publicKey,
      },
      signers: [authority],
    });
    const data = await program.account.data.fetch(puppet.publicKey);
    expect(data.data.toNumber()).to.equal(12);
  });

  it("not authorized", async () => {
    try {
      await program_master.rpc.pullString(new anchor.BN(13), {
        accounts: {
          puppet: puppet.publicKey,
          puppetProgram: program.programId,
          authority: user.publicKey,
        },
        signers: [user],
      });
      assert.fail("Expected an AnchorError to be thrown");
    } catch (error) {
      assert.ok(error instanceof AnchorError);
      assert.strictEqual(
        error.error.errorMessage,
        "You are not authorized to perform this action."
      );
    }
  });
});
