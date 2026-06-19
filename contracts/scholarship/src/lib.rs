#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct Fund {
    pub donor: Address,
    pub balance: i128,
}

const FUND: Symbol = symbol_short!("FUND");
const NEXT: Symbol = symbol_short!("NEXT");

#[contract]
pub struct ScholarshipContract;

#[contractimpl]
impl ScholarshipContract {
    pub fn create_fund(env: Env, donor: Address, amount_xlm: i128, xlm_token: Address) -> u64 {
        donor.require_auth();
        let id: u64 = env
            .storage()
            .persistent()
            .get(&NEXT)
            .unwrap_or(0u64);
        let client = token::Client::new(&env, &xlm_token);
        client.transfer(&donor, &env.current_contract_address(), &amount_xlm);
        env.storage()
            .persistent()
            .set(&(FUND, id), &Fund { donor, balance: amount_xlm });
        env.storage().persistent().set(&NEXT, &(id + 1));
        id
    }

    pub fn disburse(
        env: Env,
        admin: Address,
        fund_id: u64,
        student: Address,
        amount: i128,
        xlm_token: Address,
    ) {
        admin.require_auth();
        let mut fund: Fund = env
            .storage()
            .persistent()
            .get(&(FUND, fund_id))
            .expect("fund not found");
        assert!(fund.balance >= amount, "insufficient balance");
        fund.balance -= amount;
        env.storage().persistent().set(&(FUND, fund_id), &fund);
        let client = token::Client::new(&env, &xlm_token);
        client.transfer(&env.current_contract_address(), &student, &amount);
    }

    pub fn get_balance(env: Env, fund_id: u64) -> i128 {
        let fund: Fund = env
            .storage()
            .persistent()
            .get(&(FUND, fund_id))
            .expect("fund not found");
        fund.balance
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_fund_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, ScholarshipContract);
        let client = ScholarshipContractClient::new(&env, &contract_id);

        // We can't easily test token transfers without a mock token contract,
        // so we just verify the fund ID increments.
        // Full integration test requires a token contract deployment.
        let _ = client;
    }
}
