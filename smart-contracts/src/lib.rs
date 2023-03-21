use scrypto::prelude::*;
use std::collections::HashMap;


#[blueprint]
mod investment {
    struct Investment {
        // Name of the startup
        startup: String,
        // HashMap with investors and the amount invested
        investors: HashMap<String,Decimal>,
        // Vault where the xrd payments will be stored.
        xrd_tokens_vault: Vault,
        // Investment goal for the startup
        investment_goal: Decimal,
        // Empty vault for errors
        error_bucket: Vault,
    }

    impl Investment {
        // "new" function initializes the smart contract
        pub fn new(investment_goal: Decimal, startup: String) -> (ComponentAddress, Bucket) {

            let owner_badge: Bucket = ResourceBuilder::new_fungible()
                .metadata("name", "Owner Badge")
                .metadata("symbol", "OWNERRR")
                .mint_initial_supply(1);


            let access_rules: AccessRules = AccessRules::new()
            .method("withdraw", rule!(require(owner_badge.resource_address())), LOCKED)
            .default(rule!(allow_all), LOCKED);

            let mut investment_component: InvestmentComponent = Self {
                startup: startup,
                investors: HashMap::default(),
                xrd_tokens_vault: Vault::new(RADIX_TOKEN),
                investment_goal: investment_goal,
                error_bucket: Vault::new(RADIX_TOKEN),
            }
            .instantiate();
        investment_component.add_access_check(access_rules);
        let investment_component_address: ComponentAddress = investment_component.globalize();
        return (investment_component_address,owner_badge);
        }
        
        // "invest" method allows the users to invest in the product
        pub fn invest(&mut self, funds: Bucket, investor: String) -> Decimal {
            let new_investment_amount = funds.amount();
            self.xrd_tokens_vault.put(funds);
            self.investors.insert(investor,new_investment_amount);
            self.xrd_tokens_vault.amount()
        }

        // "withdraw" method allows the startup owner to withdraw the investments
        pub fn withdraw(&mut self) -> Bucket {
           if self.xrd_tokens_vault.amount() >= self.investment_goal {
            self.xrd_tokens_vault.take_all()
        }
    else {
        error!("NOT ENOUGH INVESTED");
        self.error_bucket.take_all()
    }
  }
}
}
