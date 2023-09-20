pub mod error;

use crate::error::ErrorDefine;
use anchor_lang::prelude::*;

declare_id!("4fxSkux5xZa7zdJfiMHPpMPu1yYBVXiHcxpV6bN6TzZ1");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.authority = authority;
        counter_account.total = 0;
        Ok(())
    }

    pub fn change_authority(ctx: Context<ChangeAuthor>, new_authority: Pubkey) -> Result<()> {
        ctx.accounts.counter_account.authority = new_authority;
        Ok(())
    }

    pub fn add(ctx: Context<Add>, number: i64) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        require!(counter_account.total + number <= 10, ErrorDefine::AddError);
        counter_account.total += number;
        Ok(())
    }

    pub fn sub(ctx: Context<Sub>, number: i64) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        require!(counter_account.total - number >= -5, ErrorDefine::SubError);
        counter_account.total -= number;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=user, space = 8 + 8 + 32)]
    pub counter_account : Account<'info, CounterData>,

    #[account(mut)]
    pub user : Signer<'info>,
    pub system_program: Program<'info , System>,
}

#[account] 
pub struct CounterData {
    pub total: i64,
    pub authority: Pubkey,
}

#[derive(Accounts)]
pub struct ChangeAuthor<'info> {
    #[account(mut,has_one=authority @ ErrorDefine::Unauthorized)]
    pub counter_account : Account<'info, CounterData>,

    #[account(mut)]
    pub authority: Signer<'info>
}

#[derive(Accounts)]
pub struct Add<'info> {
    #[account(mut, has_one=authority @ ErrorDefine::Unauthorized)]
    pub counter_account : Account<'info, CounterData>,
    
    #[account(mut)]
    pub authority: Signer<'info>
}

#[derive(Accounts)]
pub struct Sub<'info> {
    #[account(mut, has_one=authority @ ErrorDefine::Unauthorized)]
    pub counter_account : Account <'info, CounterData>,

    #[account(mut)]
    pub authority: Signer<'info>,
}
