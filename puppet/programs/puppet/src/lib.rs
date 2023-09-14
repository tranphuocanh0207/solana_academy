use anchor_lang::prelude::*;

declare_id!("DK6uto7p2mWYupWZrC4QWYHpVAHb6TybhX1q22P7aNVU");

#[program]
pub mod puppet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64, authority: Pubkey) -> Result<()> {
        ctx.accounts.puppet.data = data; 
        ctx.accounts.puppet.authority = authority;
        Ok(())
    }

    pub fn set_data(ctx: Context<SetData>, data: u64) -> Result<()> {
        require!(ctx.accounts.puppet.authority == ctx.accounts.authority.key(),ErrorCode::NotAuthorized);
        ctx.accounts.puppet.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32)]
    pub puppet: Account<'info, Data>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Data {
    pub data : u64,
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    NotAuthorized,
}