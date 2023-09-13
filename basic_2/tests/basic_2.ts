import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Basic2 } from "../target/types/basic_2";
const { SystemProgram } = anchor.web3;
import { expect, assert } from "chai";
import { AnchorError } from "@coral-xyz/anchor";

describe("basic_2", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Basic2 as Program<Basic2>;
  const counter = anchor.web3.Keypair.generate();
  it("Is initialized!", async () => {
    // Add your test here.
    const authority = provider.wallet.publicKey;
    const tx = await program.rpc.initialize(authority, {
      accounts: {
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [counter],
    });
    const counterData = await program.account.counter.fetch(counter.publicKey);
    expect(counterData.authority.toString()).to.equal(authority.toString());
    expect(counterData.count.toNumber()).to.equal(0);
  });

  it("Is increment", async () => {
    await program.rpc.increment({
      accounts: {
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      },
    });
    const counterData = await program.account.counter.fetch(counter.publicKey);
    expect(counterData.count.toNumber()).to.equal(1);
  });

  it("not authorized", async () => {
    try {
      const user2 = anchor.web3.Keypair.generate();
      await program.rpc.increment({
        accounts: {
          counter: counter.publicKey,
          authority: user2.publicKey,
        },
        signers: [user2],
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
