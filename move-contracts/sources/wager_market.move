module prediction_wager::price_prediction {
    use std::signer;
    use std::string::String;
    use std::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use pyth::price_feed;
    use pyth::price_identifier;
    use std::vector;
    use std::timestamp;
   

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
        stake_amount: u64,
        duration_seconds: u64,
    ) acquires WagerList {
        let creator_addr = signer::address_of(creator);
        let wager_list = borrow_global_mut<WagerList>(GLOBAL_WAGERS_ADDRESS);
        let wager = Wager {
            wager_id: wager_list.wagers.length(),
            creator: creator_addr,
            title,
            stake_amount,
            end_timestamp: timestamp::now_seconds() + duration_seconds,
            total_up_stake: 0,
            total_down_stake: 0,
            total_up_participants: vector::empty(),
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

    public entry fun make_bet(
        user: &signer,
        wager_id: u64,
        bet: bool,
        stake: Coin<AptosCoin>,
    ) acquires WagerList{
        let user_addr = signer::address_of(user); 
        let wager_list = borrow_global_mut<WagerList>(GLOBAL_WAGERS_ADDRESS);
        let wager_ref = vector::borrow_mut(&mut wager_list.wagers, wager_id);

        assert!(coin::value(&stake) <= wager_ref.stake_amount, ERR_INSUFFICIENT_STAKE);
        transfer(stake, wager_ref.creator);
        if (bet) {
            vector::push_back(&mut wager_ref.total_up_participants, user_addr);
            wager_ref.total_up_stake = wager_ref.total_up_stake + coin::value(&stake);
        } else {
            vector::push_back(&mut wager_ref.total_down_participants, user_addr);
            
            wager_ref.total_down_stake = wager_ref.total_down_stake + coin::value(&stake);
        }

              
    }

    
    
    // public entry fun make_prediction(
    //     user: &signer,
    //     wager_addr: address,
    //     prediction: u8,
    //     stake: Coin<AptosCoin>,
    // ) acquires Wager {
    //     let wager = borrow_global_mut<Wager>(wager_addr);
        
    //     // Validations
    //     assert!(!wager.is_settled, ERR_WAGER_CLOSED);
    //     assert!(timestamp::now_seconds() < wager.end_timestamp, ERR_WAGER_CLOSED);
    //     assert!(coin::value(&stake) == wager.stake_amount, ERR_INSUFFICIENT_STAKE);
    //     assert!(prediction == PREDICTION_UP || prediction == PREDICTION_DOWN, ERR_INVALID_PREDICTION);

    //     // Record prediction
    //     if (prediction == PREDICTION_UP) {
    //         wager.total_up_stake = wager.total_up_stake + wager.stake_amount;
    //     } else {
    //         wager.total_down_stake = wager.total_down_stake + wager.stake_amount;
    //     };

    //     // Store user prediction
    //     move_to(user, UserPrediction {
    //         wager_id: wager_addr,
    //         user: signer::address_of(user),
    //         prediction,
    //         stake,
    //         claimed: false,
    //     });
    // }

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