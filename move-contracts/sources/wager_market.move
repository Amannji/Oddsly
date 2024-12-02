module prediction_wager::price_prediction {
    use std::signer;
    use std::coin::{transfer};
    use std::string::String;
    use std::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use pyth::price_feed;
    use pyth::price_identifier;
    use std::vector;

    /// Errors
    const ERR_INSUFFICIENT_STAKE: u64 = 1;
    const ERR_INVALID_PREDICTION: u64 = 2;
    const ERR_WAGER_CLOSED: u64 = 3;
    const ERR_NOT_READY_FOR_SETTLEMENT: u64 = 4;

    /// Represents a price prediction direction
    const PREDICTION_UP: u8 = 0;
    const PREDICTION_DOWN: u8 = 1;

    

    struct Wager has key, store, copy, drop{
        wager_id: u64,
        creator: address,
        title: String,
        currency_id: String,
        target_price: u64,
        stake_amount: u64,
        end_timestamp: u64,
        total_up_stake: u64,
        total_up_participants: vector<address>,
        total_down_participants: vector<address>,
        total_down_stake: u64,
        is_settled: bool,
        winner: bool,
    }

    struct WagerCounter has key {
        count: u64,
    }

    struct WagerList has key {
        wagers: vector<Wager>
    }

    const GLOBAL_WAGERS_ADDRESS: address = @prediction_wager;

    // struct UserPrediction has key {
    //     wager_id: address,
    //     user: address,
    //     prediction: u8,
    //     stake: Coin<AptosCoin>,
    //     claimed: bool,
    // }

    fun init_module(creator: &signer) {
        let creator_addr = signer::address_of(creator);
        move_to(creator, WagerList { wagers: vector::empty() });
        move_to(creator, WagerCounter { count: 0 });
    }

    public entry fun create_wager(
        creator: &signer,
        title: String,
        currency_id: String,
        target_price: u64,
        stake_amount: u64,
        duration_seconds: u64,
    ) acquires WagerList {
        let creator_addr = signer::address_of(creator);
        let wager_list = borrow_global_mut<WagerList>(GLOBAL_WAGERS_ADDRESS);
        let wager = Wager {
            wager_id: vector::length(&wager_list.wagers),
            creator: creator_addr,
            title,
            currency_id,
            target_price,
            stake_amount,
            end_timestamp: timestamp::now_seconds() + duration_seconds,
            total_up_stake: 0,
            total_up_participants: vector::empty(),
            total_down_stake: 0,
            total_down_participants: vector::empty(),
            is_settled: false,
            winner: false,
        };        
        vector::push_back(&mut wager_list.wagers, wager); 
        
    }

    #[view]
    public fun view_all_wagers(): vector<Wager> acquires WagerList {
        let wager_list = borrow_global<WagerList>(GLOBAL_WAGERS_ADDRESS);
        return wager_list.wagers
    }

    #[view]
    public fun view_my_wagers(user: address): vector<Wager> acquires WagerList {
        let wager_list = borrow_global<WagerList>(GLOBAL_WAGERS_ADDRESS);
        let my_wagers = vector::empty<Wager>();
        
        let len = vector::length(&wager_list.wagers);
        let i = 0;  
        
        while (i < len) {
            let wager = vector::borrow(&wager_list.wagers, i);
            if (vector::contains(&wager.total_up_participants, &user) || 
                vector::contains(&wager.total_down_participants, &user)) {
                vector::push_back(&mut my_wagers, *wager);
            };
            i = i + 1;
        };
        return my_wagers
    }

    #[view]
    public fun view_new_wagers(user: address): vector<Wager> acquires WagerList {
        let wager_list = borrow_global<WagerList>(GLOBAL_WAGERS_ADDRESS);
        let new_wagers = vector::empty<Wager>();
        let i = 0;
        let len = vector::length(&wager_list.wagers);
        while (i < len) {
            let wager = vector::borrow(&wager_list.wagers, i);
            if (!vector::contains(&wager.total_up_participants, &user) && 
                !vector::contains(&wager.total_down_participants, &user)) {
                vector::push_back(&mut new_wagers, *wager);
            };

            i = i + 1;
        };
        return new_wagers
    }

    
    public entry fun make_bet(
        user: &signer,
        wager_id: u64,
        bet: bool,
        stake: u64,
    ) acquires WagerList {
        let user_addr = signer::address_of(user);
        let wager_list = borrow_global_mut<WagerList>(GLOBAL_WAGERS_ADDRESS);
        let wager_ref = vector::borrow_mut(&mut wager_list.wagers, wager_id);

        if( wager_ref.wager_id == wager_id){
            assert!(wager_ref.end_timestamp > timestamp::now_seconds(), ERR_WAGER_CLOSED);
        assert!(wager_ref.stake_amount <= stake, ERR_INSUFFICIENT_STAKE);

        transfer<AptosCoin>(user,wager_ref.creator, stake);
        if(bet){
                wager_ref.total_up_stake = wager_ref.total_up_stake + stake;
                vector::push_back(&mut wager_ref.total_up_participants, user_addr);
            } else {
                wager_ref.total_down_stake = wager_ref.total_down_stake + stake;
            vector::push_back(&mut wager_ref.total_down_participants, user_addr);
        }
        }
    }

     
        

    
    

    // public entry fun settle_wager(wager_addr: address) acquires Wager {
    //     let wager = borrow_global_mut<Wager>(wager_addr);
        
    //     // Validations
    //     assert!(!wager.is_settled, ERR_WAGER_CLOSED);
    //     assert!(timestamp::now_seconds() >= wager.end_timestamp, ERR_NOT_READY_FOR_SETTLEMENT);

    //     // Get price from Pyth
    //     let price_feed = price_feed::get_price_feed_by_id(wager.price_feed_id);
    //     let current_price = price_feed::get_price(&price_feed);
        
    //     // Mark as settled
    //     wager.is_settled = true;
    // }

    // public entry fun claim_winnings(
    //     user: &signer,
    //     wager_addr: address
    // ) acquires Wager, UserPrediction {
    //     let wager = borrow_global<Wager>(wager_addr);
    //     assert!(wager.is_settled, ERR_NOT_READY_FOR_SETTLEMENT);

    //     let user_prediction = borrow_global_mut<UserPrediction>(signer::address_of(user));
    //     assert!(!user_prediction.claimed, ERR_WAGER_CLOSED);

    //     // Calculate and transfer winnings
    //     // Implementation depends on your reward distribution logic
    // }
} 