pragma solidity ^0.4.18;

contract Casino {
    address private owner;
    uint public minimumBet;
    uint public  totalBet;
    uint public  numberOfBets;
    uint public randomNum;
    uint public  maxAmountOfBets = 5;
    address[] players;
    string[] colors = ["A", "K", "Q", "D"];
    
    struct Card {
        uint number;
        string color;
    }
    
    struct Player {
       uint amountBet;
       Card bet;
    }
    
    event LatestWinn(uint number, string color);
    
    mapping(address => Player) playerInfo;
    
    function Casino(uint256 _minimumBet) public {
        owner = msg.sender;
        
        if(_minimumBet != 0) {
            minimumBet = _minimumBet;
        }
    }
    
    modifier IsOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function bet(uint number, string color) payable public {
        assert(checkPlayerExists(msg.sender) == false);
        assert(number >=1 && number <= 4);
        assert(keccak256(color) == keccak256("A") || keccak256(color) == keccak256("K") || keccak256(color) == keccak256("Q") || keccak256(color) == keccak256("D"));
        assert(msg.value >= minimumBet);
        
        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].bet = Card(number, color);
        numberOfBets += 1;
        players.push(msg.sender);
        totalBet += msg.value;
        if(numberOfBets >= maxAmountOfBets) generateNumberWinner();
    }
    
    function checkPlayerExists(address playerAddr) view public returns(bool) {
        for(uint i = 0; i < players.length; i++) {
            if(players[i] == playerAddr) {
                return true;
            }
        }
        
        return false;
    }
    
    function generateNumberWinner() public {
        randomNum = block.timestamp % 10 % 4;
        uint randomColorNumber = block.number % 4;
        if(randomNum == 0) {
            randomNum = 4;
        }
        
        if(randomColorNumber == 0) {
            randomColorNumber = 4;
        }
        
        string colorWinner = colors[randomColorNumber - 1];
        
        emit LatestWinn(randomNum, colorWinner);
        distibutePrice(randomNum, colorWinner);
    }
    
    function distibutePrice(uint number, string color) private { 
        address[5] memory winners;
        uint count = 0;
        
        for(uint i = 0; i < players.length; i++){
            address playerAddress = players[i];
            bool winner = playerInfo[playerAddress].bet.number == number && keccak256(playerInfo[playerAddress].bet.color) == keccak256(color);
            
            if(winner) {
                winners[count] = playerAddress;
                count++;
            }
            
            delete playerInfo[playerAddress];
        }
        
        players.length = 0;
        
        if(count == 0) {
            owner.transfer(totalBet);
        }
        else {
            uint256 winnerEtherAmount = totalBet / count;
            for(uint j = 0; j < count; j++){
                if(winners[j] != address(0)) {
                    winners[j].transfer(winnerEtherAmount);
                }
            }
        }
        
        resetData();
    }
    
    function resetData() private {
       players.length = 0; 
       totalBet = 0;
       numberOfBets = 0;
    }
    
    function kill() IsOwner public {
        selfdestruct(owner);
    }
    
    function() payable public {}
}