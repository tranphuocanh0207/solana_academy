use anchor_lang::prelude::*;
use puppet::cpi::accounts::SetData;
use puppet::program::Puppet;
use puppet::{self, Data};

declare_id!("7xwZVhCfjAiX4vRuS7sgBDeru4qLR9Vi3dv7XQH5hcYM");

#[program]
pub mod puppet_master {
    use super::*;

    pub fn pull_string(ctx: Context<PullString>, data: u64) -> Result<()> {
        puppet::cpi::set_data(ctx.accounts.set_data_ctx(), data)?;
        ctx.accounts.puppet.reload()?;
        if ctx.accounts.puppet.data != data {
            panic!();
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct PullString<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, Puppet>,
    pub authority: Signer<'info>,
}

impl<'info> PullString<'info> { 
    pub fn set_data_ctx(&self) -> CpiContext<'_, '_, '_, 'info, SetData<'info>> {
        let cpi_program = self.puppet_program.to_account_info();
        let cpi_accounts = SetData {
            puppet : self.puppet.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

