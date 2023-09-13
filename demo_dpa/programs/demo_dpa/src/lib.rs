use anchor_lang::prelude::*;

declare_id!("9cT1Kv3vJUzgrtnPKQpBqscUG6mzw6dkYHMSMpuVKA4H");

#[program]
pub mod demo_dpa {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, vote_account_bump: u8) -> Result<()> {
        ctx.accounts.vote_account.bump = vote_account_bump; 
        Ok(())
    }

    pub fn update_pizza(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.vote_account.pizza += 1;
        Ok(())
    }

    pub fn update_hamburger(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.vote_account.hamburger += 1;
        Ok(())
    }

    pub fn update_hamburger1(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.vote_account.hamburger += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, seeds = [b"seed".as_ref()], bump, payer = user, space = 8 + 16 + 1)]
    pub vote_account: Account<'info, VotingState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub vote_account: Account<'info, VotingState>,
}

#[account]
pub struct VotingState {
    pub pizza: u64,
    pub hamburger: u64,
    pub bump: u8,
}