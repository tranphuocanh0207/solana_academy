use anchor_lang::prelude::*;

declare_id!("9P9KwpyHE7MmGXQMgkcYcWG3pUkPXq9VzpXrmReBoCTX");

#[program]
pub mod pda_transfer_service_fee_lamports {
    use super::*;
    use anchor_lang::solana_program::{program::invoke, system_instruction};

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.pda.authority = ctx.accounts.authority.key();
        ctx.accounts.pda.bump = *ctx.bumps.get("pda").unwrap();
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let from = &ctx.accounts.wallet.to_account_info();
        let to = &ctx.accounts.pda.to_account_info();
        let system_program = &ctx.accounts.system_program.to_account_info();

        invoke(
            &system_instruction::transfer(
                &from.key(),
                &to.key(),
                amount,
            ),
            &[
                from.clone(),
                to.clone(),
                system_program.clone(),
            ],
        )?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let from = &ctx.accounts.pda.to_account_info();
        let to = &ctx.accounts.wallet.to_account_info();
        transfer_service_fee_lamports(
            from,
            to,
            amount
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    authority: Signer<'info>,
    #[account(init, payer = authority , space = 8 + 32 + 1, seeds = [b"pda".as_ref()], bump)]
    pda: Account<'info, Pda>,
    system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, has_one = authority @ ErrorCode::Unauthorized, seeds = [b"pda".as_ref()], bump)]
    pda: Account<'info, Pda>,
    #[account(mut)]
    authority: Signer<'info>,
    ///CHECK
    wallet: AccountInfo<'info>,
    system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = authority @ ErrorCode::Unauthorized, seeds = [b"pda".as_ref()], bump)]
    pda: Account<'info, Pda>,
    #[account(mut)]
    authority: Signer<'info>,
    ///CHECK
    wallet: AccountInfo<'info>,
    system_program: Program<'info, System>
}

#[account]
pub struct Pda {
    authority: Pubkey,
    bump : u8,
}


#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized !!!")]
    Unauthorized,
    #[msg("Insufficient funds for transaction.")]
    InsufficientFundsForTransaction,
}

fn transfer_service_fee_lamports(
    from_account: &AccountInfo,
    to_account: &AccountInfo,
    amount_of_lamports: u64
) -> Result<()> {
    if **from_account.try_borrow_lamports()? < amount_of_lamports {
        return Err(ErrorCode::InsufficientFundsForTransaction.into());
    }
    **from_account.try_borrow_mut_lamports()? -= amount_of_lamports;
    **to_account.try_borrow_mut_lamports()? += amount_of_lamports;
    Ok(())
}