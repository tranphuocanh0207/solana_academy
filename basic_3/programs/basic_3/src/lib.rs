use anchor_lang::prelude::*;

declare_id!("Ca24mviGhNg2VAZ2HhTH1Fb1u8MnkbvWPhwFer9UJ856");

#[program]
pub mod basic_3 {
    use super::*;

    pub fn create_user_stats(ctx: Context<CreateUserStats>, name: String) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.level = 0;
        if name.as_bytes().len() > 200 {
            panic!();
        }
        user_stats.name = name;
        user_stats.bump = *ctx.bumps.get("user_stats").unwrap();
        Ok(())
    }

    pub fn change_name(ctx: Context<ChangeName>, name: String) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        if name.as_bytes().len() > 200 {
            panic!();
        }
        user_stats.name = name;
        Ok(())
    }

    pub fn create_data(ctx: Context<CreateData>, data: u64) -> Result<()> {
        let data_account = &mut ctx.accounts.data_account;
        data_account.data = data;
        Ok(())
    }
}

#[account]
pub struct UserStats {
    level: u16,
    name : String,
    bump: u8,
}

#[account]
pub struct Data {
    data: u64
}

#[derive(Accounts)]
pub struct CreateData<'info> {
    #[account(mut)]
    pub user : Signer<'info>,
    #[account(init, payer = user, space = 8 + 8 )]
    pub data_account : Account<'info , Data>,
    pub system_program : Program<'info , System>,
}

#[derive(Accounts)]
pub struct CreateUserStats<'info> {
    #[account(mut)]
    pub user : Signer<'info>,
    #[account(init , payer = user, space = 8 + 2 + 4 + 200 + 1, seeds = [b"user-stats", user.key().as_ref()], bump)]
    pub user_stats : Account<'info, UserStats>,
    pub system_program : Program<'info , System>,
}

#[derive(Accounts)]
pub struct ChangeName<'info> {
    #[account(mut)]
    pub user_stats : Account<'info, UserStats>,
}







