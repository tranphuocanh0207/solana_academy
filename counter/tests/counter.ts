import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { expect , assert} from "chai";
const { SystemProgram } = anchor.web3;
import { AnchorError } from "@coral-xyz/anchor";

describe("counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;
  const counterAccount = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();
  const wallet = provider.wallet;
  const newUser = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    await program.rpc.initialize(user.publicKey, {
      accounts: {
        counterAccount: counterAccount.publicKey,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [counterAccount],
    });
    const counterData = await program.account.counterData.fetch(
      counterAccount.publicKey
    );
    expect(counterData.authority.toString()).to.equal(
      user.publicKey.toString()
    );
    expect(counterData.total.toNumber()).to.equal(0);
  });

  it("Change authority", async () => {
    await program.rpc.changeAuthority(newUser.publicKey, {
      accounts: {
        counterAccount: counterAccount.publicKey,
        authority: user.publicKey,
      },
      signers: [user]
    });
    const counterData = await program.account.counterData.fetch(counterAccount.publicKey);
    expect(counterData.authority.toString()).to.equal(newUser.publicKey.toString());
    expect(counterData.total.toNumber()).to.equal(0);
  });

  it("Unauthorized", async () => {
    try {
      const user2 = anchor.web3.Keypair.generate();
      await program.rpc.add(new anchor.BN(1),{
        accounts: {
          counterAccount: counterAccount.publicKey,
          authority: user2.publicKey,
        },
        signers: [user2],
      });
      assert.fail("Expected an AnchorError to be thrown");
    } catch (error) {
      assert.ok(error instanceof AnchorError);
      assert.strictEqual(
        error.error.errorMessage,
        "Unauthorized !!!"
      );
    }
  })

  it("Add", async ()=> {
    const counterDataBefore = await program.account.counterData.fetch(counterAccount.publicKey);

    await program.rpc.add(new anchor.BN(1), {
      accounts: {
        counterAccount: counterAccount.publicKey,
        authority: newUser.publicKey,
      },
      signers: [newUser]
    });
    const counterDataAfter = await program.account.counterData.fetch(counterAccount.publicKey);
    expect(counterDataAfter.total.toNumber()).to.equal(counterDataBefore.total.toNumber()  + 1);
  });

  it("Maximum total is 10", async () => {
    try {
      await program.rpc.add(new anchor.BN(10),{
        accounts: {
          counterAccount: counterAccount.publicKey,
          authority: newUser.publicKey,
        },
        signers: [newUser],
      });
      assert.fail("Expected an AnchorError to be thrown");
    } catch (error) {
      assert.ok(error instanceof AnchorError);
      assert.strictEqual(
        error.error.errorMessage,
        "Maximum total is 10"
      );
    }
  })

  it("Sub", async () => {
    const counterDataBefore = await program.account.counterData.fetch(counterAccount.publicKey);
    await program.rpc.sub(new anchor.BN(2), {
      accounts : {
        counterAccount: counterAccount.publicKey,
        authority: newUser.publicKey,
      },
      signers: [newUser]
    });
    const counterDataAfter = await program.account.counterData.fetch(counterAccount.publicKey);
    expect(counterDataAfter.total.toNumber()).to.equal(counterDataBefore.total.toNumber()  - 2);
  })

  it("Minimum total is -5", async ()=> {
    try {
      await program.rpc.sub(new anchor.BN(10),{
        accounts: {
          counterAccount: counterAccount.publicKey,
          authority: newUser.publicKey,
        },
        signers: [newUser],
      });
      assert.fail("Expected an AnchorError to be thrown");
    } catch (error) {
      assert.ok(error instanceof AnchorError);
      assert.strictEqual(
        error.error.errorMessage,
        "Minimum total is -5"
      );
    }
  })
});
