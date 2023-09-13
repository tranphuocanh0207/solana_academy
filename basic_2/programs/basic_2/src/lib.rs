use anchor_lang::prelude::*;

declare_id!("2Dm9UEFpx8kCf2y5viPpHnBxpvtpEot1EDdsPPb6UQJ7");

#[program]
pub mod basic_2 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority : Pubkey) -> Result<()> {
        ctx.accounts.counter.authority = authority;
        ctx.accounts.counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.authority.key(),
            ctx.accounts.counter.authority,
            ErrorCode::Unauthorized
        );
        ctx.accounts.counter.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32 )]
    pub counter : Account<'info, Counter>,
    #[account(mut)]
    pub user : Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter : Account<'info, Counter>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count : u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}
