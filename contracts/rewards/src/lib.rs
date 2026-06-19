#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, token, Address, Env, Symbol,
};

const POINTS: Symbol = symbol_short!("POINTS");
// 1 point = 0.01 XLM = 100_000 stroops
const STROOP_PER_POINT: i128 = 100_000;

#[contract]
pub struct RewardsContract;

#[contractimpl]
impl RewardsContract {
    pub fn award_points(env: Env, admin: Address, student: Address, amount: i128) {
        admin.require_auth();
        let current: i128 = env
            .storage()
            .persistent()
            .get(&(POINTS, student.clone()))
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&(POINTS, student), &(current + amount));
    }

    pub fn get_points(env: Env, student: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&(POINTS, student))
            .unwrap_or(0)
    }

    /// Redeems all points for XLM, transferring from contract to student.
    pub fn redeem_points(env: Env, student: Address, xlm_token: Address) {
        student.require_auth();
        let points: i128 = env
            .storage()
            .persistent()
            .get(&(POINTS, student.clone()))
            .unwrap_or(0);
        assert!(points > 0, "no points");
        let stroops = points * STROOP_PER_POINT;
        env.storage()
            .persistent()
            .set(&(POINTS, student.clone()), &0_i128);
        let client = token::Client::new(&env, &xlm_token);
        client.transfer(&env.current_contract_address(), &student, &stroops);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_award_and_get() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, RewardsContract);
        let client = RewardsContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let student = Address::generate(&env);
        client.award_points(&admin, &student, &50);
        assert_eq!(client.get_points(&student), 50);
        client.award_points(&admin, &student, &25);
        assert_eq!(client.get_points(&student), 75);
    }
}
