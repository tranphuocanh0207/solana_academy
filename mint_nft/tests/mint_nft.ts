import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { R08AnchorMintnft } from "../target/types/r08_anchor_mintnft";
import { ComputeBudgetProgram} from "@solana/web3.js"

describe("r08_anchor_mintnft", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());


  const program = anchor.workspace
    .R08AnchorMintnft as Program<R08AnchorMintnft>;

 const testNftTitle = "LuckyTech NFT";
  const testNftSymbol = "LTN";
  const testNftUri = "https://bafkreieixr42iwe2kqa5adwlrnaqufadb3ys53sy6dbp6niybfetcmqupe.ipfs.nftstorage.link/";
  const provider = anchor.AnchorProvider.env();
  const wallet = provider.wallet as anchor.Wallet;
  // anchor.setProvider(provider);

  // const program = anchor.workspace.MintNft as anchor.Program<R08AnchorMintnft>;

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
  const ASSOCIATED_TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  );
  it("Mint!", async () => {
    // Derive the mint address and the associated token account address

    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: wallet.publicKey,
    });
    console.log(`New token: ${mintKeypair.publicKey}`);

    // Derive the metadata and master edition addresses

    const metadataAddress = (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    console.log("Metadata initialized");
    const masterEditionAddress = (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    console.log("Master edition metadata initialized");
    const additionalComputeBudgetInstruction =
    ComputeBudgetProgram.requestUnits({
      units: 400000,
      additionalFee: 0,
    });
    // Transact with the "mint" function in our on-chain program
        try {
          
      const tx = await program.methods
      .mint(testNftTitle, testNftSymbol, testNftUri)
      .accounts({
        masterEdition: masterEditionAddress,
        metadata: metadataAddress,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAddress,
        mintAuthority: wallet.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .signers([mintKeypair]).preInstructions([
        ComputeBudgetProgram.setComputeUnitLimit({ units: 500000 })
      ])
      .rpc();
        } catch (error) {
          console.log(error);
        }
  
    
  });
});