"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
const MyRoomState_1 = require("./schema/MyRoomState");
class MyRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 6;
    }
    onCreate(options) {
        this.setState(new MyRoomState_1.MyRoomState());
        this.onMessage("startGame", () => this.startGame());
        this.onMessage("bet", (client, amount) => this.handleBet(client, amount));
        this.onMessage("fold", (client) => this.handleFold(client));
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const player = new MyRoomState_1.Player(client.sessionId);
        player.name = options.name || `Player-${client.sessionId.slice(0, 4)}`;
        this.state.users.set(client.sessionId, player);
        client.send("joined", { name: player.name });
    }
    onLeave(client) {
        console.log(client.sessionId, "left!");
        this.state.users.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
    startGame() {
        console.log("Game started!");
        this.state.roundStarted = true;
        this.state.pot = 0;
        this.state.communityCards.clear();
        this.state.resetDeck();
        this.state.phase = "preflop"; // Make sure to set initial phase
        // Deal 2 cards to each player
        this.state.users.forEach(player => {
            player.hand = new schema_1.ArraySchema(this.state.dealCard(), this.state.dealCard());
            player.currentBet = 0;
            player.isFolded = false;
        });
        // Select first player to act
        const firstPlayer = Array.from(this.state.users.values())[0];
        if (firstPlayer) {
            this.state.currentTurn = firstPlayer.sessionId;
            this.state.lastRaiser = firstPlayer.sessionId; // Track last raiser for betting rounds
        }
    }
    handleBet(client, amount) {
        const player = this.state.users.get(client.sessionId);
        if (!player || player.isFolded || amount > player.chips)
            return;
        player.chips -= amount;
        player.currentBet += amount;
        this.state.pot += amount;
        // Optionally update last raiser if this bet is a raise
        if (player.currentBet > this.state.currentBet) {
            this.state.currentBet = player.currentBet;
            this.state.lastRaiser = player.sessionId;
        }
        this.advanceTurn();
    }
    handleFold(client) {
        const player = this.state.users.get(client.sessionId);
        if (player) {
            player.isFolded = true;
        }
        this.advanceTurn();
    }
    advanceTurn() {
        var _a;
        const activeusers = Array.from(this.state.users.values())
            .filter(p => !p.isFolded);
        if (activeusers.length === 0) {
            // No users left, end round
            this.finishHand();
            return;
        }
        const currentIndex = activeusers.findIndex(p => p.sessionId === this.state.currentTurn);
        let nextIndex = (currentIndex + 1) % activeusers.length;
        // If betting round is complete (e.g. everyone called last raise), move to next street
        if (this.state.currentTurn === this.state.lastRaiser) {
            this.nextStreet();
            return;
        }
        this.state.currentTurn = ((_a = activeusers[nextIndex]) === null || _a === void 0 ? void 0 : _a.sessionId) || "";
    }
    // ------------------- new helper inside MyRoom -------------------
    nextStreet() {
        var _a;
        // reset street-level bets
        this.state.users.forEach(p => p.currentBet = 0);
        this.state.currentBet = 0;
        if (this.state.phase === "preflop") {
            // FLOP – 3 cards
            this.state.communityCards.push(this.state.dealCard(), this.state.dealCard(), this.state.dealCard());
            this.state.phase = "flop";
        }
        else if (this.state.phase === "flop") {
            // TURN – 1 card
            this.state.communityCards.push(this.state.dealCard());
            this.state.phase = "turn";
        }
        else if (this.state.phase === "turn") {
            // RIVER – 1 card
            this.state.communityCards.push(this.state.dealCard());
            this.state.phase = "river";
        }
        else {
            // SHOWDOWN
            this.finishHand();
            return;
        }
        // first active player after the dealer acts first on post-flop streets
        const actives = Array.from(this.state.users.values()).filter(p => !p.isFolded);
        this.state.currentTurn = ((_a = actives[0]) === null || _a === void 0 ? void 0 : _a.sessionId) || "";
        this.state.lastRaiser = this.state.currentTurn;
    }
    finishHand() {
        // Implement your showdown logic here, e.g. determine winner, payout chips, reset round etc.
        console.log("Showdown!");
        this.state.roundStarted = false;
        // Additional cleanup/reset code here
    }
}
exports.MyRoom = MyRoom;
