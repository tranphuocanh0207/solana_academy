use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorDefine {
    #[msg("Minimum total is -5")]
    SubError,

    #[msg("Maximum total is 10")]
    AddError,

    #[msg("Unauthorized !!!")]
    Unauthorized,
}
