use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::system_instruction;

declare_id!("4eXeeKKDqW2e7TYycJ3p8vxK5hqLjkhRRvARcMMGbSWA");

#[program]
pub mod transfer_pda_invoke_signed {
    use super::*;

    pub fn transfer_provider_sol(
        ctx: Context<TransferProviderSol>,
        amount: u64,
        bump: u8,
    ) -> Result<()> {
        let ix = system_instruction::transfer(ctx.accounts.pda.key, ctx.accounts.taker.key, amount);

        invoke_signed(
            &ix,
            &[
                ctx.accounts.pda.to_account_info(),
                ctx.accounts.taker.to_account_info(),
            ],
            &[&[b"myseed", &[bump]]],
        )?;
        Ok(())
    }

    pub fn transfer_user_sol(ctx: Context<TransferUserSol>, amount: u64, bump: u8) -> Result<()> {
        let ix = system_instruction::transfer(
            ctx.accounts.pda.key,
            ctx.accounts.taker.key,
            amount,
        );

        invoke_signed(
            &ix,
            &[
                ctx.accounts.pda.to_account_info(),
                ctx.accounts.taker.to_account_info(),
            ],
            &[
                &[
                    b"myseed",
                    ctx.accounts.user.key.as_ref(),
                    &[bump],
                ]
            ],
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferProviderSol<'info> {
    #[account(mut)]
    pda: SystemAccount<'info>,
    #[account(mut)]
    taker: SystemAccount<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferUserSol<'info> {
    pub user: Signer<'info>,
    #[account(mut)]
    pda: SystemAccount<'info>,
    #[account(mut)]
    taker: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
