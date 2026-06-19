#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct Credential {
    pub institution: Address,
    pub student: Address,
    pub course_hash: Bytes,
    pub revoked: bool,
}

const CRED: Symbol = symbol_short!("CRED");

#[contract]
pub struct CredentialContract;

#[contractimpl]
impl CredentialContract {
    pub fn issue_credential(
        env: Env,
        institution: Address,
        student: Address,
        course_hash: Bytes,
    ) -> u64 {
        institution.require_auth();
        let id: u64 = env.ledger().sequence() as u64;
        let cred = Credential {
            institution,
            student,
            course_hash,
            revoked: false,
        };
        env.storage().persistent().set(&(CRED, id), &cred);
        id
    }

    pub fn verify_credential(env: Env, id: u64) -> Option<Credential> {
        env.storage().persistent().get(&(CRED, id))
    }

    pub fn revoke_credential(env: Env, id: u64) {
        let mut cred: Credential = env
            .storage()
            .persistent()
            .get(&(CRED, id))
            .expect("not found");
        cred.institution.require_auth();
        cred.revoked = true;
        env.storage().persistent().set(&(CRED, id), &cred);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Bytes, Env};

    #[test]
    fn test_issue_verify_revoke() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, CredentialContract);
        let client = CredentialContractClient::new(&env, &contract_id);

        let institution = Address::generate(&env);
        let student = Address::generate(&env);
        let hash = Bytes::from_slice(&env, b"abc123coursehash");

        let id = client.issue_credential(&institution, &student, &hash);
        let cred = client.verify_credential(&id).unwrap();
        assert!(!cred.revoked);

        client.revoke_credential(&id);
        let cred2 = client.verify_credential(&id).unwrap();
        assert!(cred2.revoked);
    }
}
