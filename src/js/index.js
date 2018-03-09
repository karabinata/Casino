import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'

class App extends React.Component {
   constructor(props){
      super(props)
      this.state = {
         latestWinn: {number: 0, color: "F"},
         numberOfBets: 0,
         minimumBet: 0,
         totalBet: 0,
         maxAmountOfBets: 0,
      }
if(typeof web3 != 'undefined'){
         console.log("Using web3 detected from external source like Metamask")
         this.web3 = new Web3(web3.currentProvider)
      }else{
         console.log("No web3 detected.");
         this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
      }
const MyContract = web3.eth.contract([
	{
		"constant": true,
		"inputs": [],
		"name": "totalBet",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numberOfBets",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minimumBet",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "maxAmountOfBets",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "playerAddr",
				"type": "address"
			}
		],
		"name": "checkPlayerExists",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "randomNum",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "generateNumberWinner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "number",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "color",
				"type": "string"
			}
		],
		"name": "LatestWinn",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "number",
				"type": "uint256"
			},
			{
				"name": "color",
				"type": "string"
			}
		],
		"name": "bet",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_minimumBet",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
])
      this.state.ContractInstance = MyContract.at("0x9a12fa2b64e3bc5a24f75cf5f849a5de96bcac89")
	}

componentDidMount(){
      this.updateState()
      this.setupListeners()
setInterval(this.updateState.bind(this), 10e3)
   }
updateState(){
      this.state.ContractInstance.minimumBet((err, result) => {
         if(result != null){
            this.setState({
               minimumBet: parseFloat(web3.fromWei(result, 'ether'))
            })
         }
      })
      this.state.ContractInstance.totalBet((err, result) => {
         if(result != null){
            this.setState({
               totalBet: parseFloat(web3.fromWei(result, 'ether'))
            })
         }
      })
      this.state.ContractInstance.numberOfBets((err, result) => {
         if(result != null){
            this.setState({
               numberOfBets: parseInt(result)
            })
         }
      })
      this.state.ContractInstance.maxAmountOfBets((err, result) => {
         if(result != null){
            this.setState({
               maxAmountOfBets: parseInt(result)
            })
         }
	  })
	  var filter = { address: web3.eth.accounts[0] };
	  var events = this.state.ContractInstance.allEvents(filter);
	  
      events.watch((err, result) => {
		  console.log('result: ' + result.number)
          if(!error){
              this.setState({
				  latestWinn: {number: result.number, color: result.color}
              })
          }
      })
   }

   setupListeners() {
      let numberNodes = this.refs.numbers.querySelectorAll('li')
      numberNodes.forEach(number => {
         number.addEventListener('click', event => {
            event.target.className = 'number-selected'
            let betSymbols = event.target.id.split('')
            let symbol = betSymbols[0]
            let number = parseInt(betSymbols[1])
            this.voteNumber(number, symbol, done => {

               // Remove the other number selected
               for(let i = 0; i < numberNodes.length; i++){
                numberNodes[i].className = ''
               }
            })
         })
      })
   }
   
voteNumber(number, color, cb){
      let bet = this.refs['ether-bet'].value
if(!bet) bet = 0.1
if(parseFloat(bet) < this.state.minimumBet){
         alert('You must bet more than the minimum')
         cb()
      } else {
         this.state.ContractInstance.bet(number, color, {
            gas: 300000,
            from: web3.eth.accounts[0],
            value: web3.toWei(bet, 'ether')
         }, (err, result) => {
            cb()
         })
      }
   }

render(){
      return (
         <div className="main-container">
            <h1>Bet for your best card</h1>
<div className="block">
               <b>Number of bets:</b> &nbsp;
               <span>{this.state.numberOfBets}</span>
            </div>
<div className="block">
               <b>Total ether bet:</b> &nbsp;
               <span>{this.state.totalBet} ether</span>
            </div>
<div className="block">
               <b>Minimum bet:</b> &nbsp;
               <span>{this.state.minimumBet} ether</span>
            </div>
<div className="block">
               <b>Latest winning card:</b> &nbsp;
               <span>{ this.state.latestWinn.number} {console.log(this.state.latestWinn.number)}</span>
            </div>
<hr/>
<h2>Vote for the next card</h2>
    <label>
        <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBet}/></b> ether
        <br/>
    </label>
   <ul ref="numbers" class="outline shadow rounded">
        <li id="A1"><div class="top"><span>A</span><span>&spades;</span></div>
			<h1>&spades;</h1>
			<div class="bottom"><span>&spades;</span><span>A</span></div>
		</li>
        <li id="A2">
			<div class="top"><span>A</span><span>&hearts;</span></div>
			<h1>&hearts;</h1>
			<div class="bottom"><span>&hearts;</span><span>A</span></div>
		</li>
        <li id="A3">
			<div class="top"><span>A</span><span>&diams;</span></div>
			<h1>&diams;</h1>
			<div class="bottom"><span>&diams;</span><span>A</span></div>
		</li>
        <li id="A4">
			<div class="top"><span>A</span><span>&clubs;</span></div>
			<h1>&clubs;</h1>
			<div class="bottom"><span>&clubs;</span><span>A</span></div>
	    </li>
        <li id="K1"><div class="top"><span>K</span><span>&spades;</span></div>
			<h1>&spades;</h1>
			<div class="bottom"><span>&spades;</span><span>K</span></div>
		</li>
        <li id="K2">
			<div class="top"><span>K</span><span>&hearts;</span></div>
			<h1>&hearts;</h1>
			<div class="bottom"><span>&hearts;</span><span>K</span></div>
		</li>
        <li id="K3">
			<div class="top"><span>K</span><span>&diams;</span></div>
			<h1>&diams;</h1>
			<div class="bottom"><span>&diams;</span><span>K</span></div>
		</li>
        <li id="K4">
			<div class="top"><span>K</span><span>&clubs;</span></div>
			<h1>&clubs;</h1>
			<div class="bottom"><span>&clubs;</span><span>K</span></div>
		</li>
        <li id="Q1"><div class="top"><span>Q</span><span>&spades;</span></div>
			<h1>&spades;</h1>
			<div class="bottom"><span>&spades;</span><span>Q</span></div>
		</li>
        <li id="Q2">
			<div class="top"><span>Q</span><span>&hearts;</span></div>
			<h1>&hearts;</h1>
			<div class="bottom"><span>&hearts;</span><span>Q</span></div>
		</li>
        <li id="Q3">
			<div class="top"><span>Q</span><span>&diams;</span></div>
			<h1>&diams;</h1>
			<div class="bottom"><span>&diams;</span><span>Q</span></div>
		</li>
        <li id="Q4">
			<div class="top"><span>Q</span><span>&clubs;</span></div>
			<h1>&clubs;</h1>
			<div class="bottom"><span>&clubs;</span><span>Q</span></div>
		</li>
        <li id="D1"><div class="top"><span>D</span><span>&spades;</span></div>
			<h1>&spades;</h1>
			<div class="bottom"><span>&spades;</span><span>D</span></div>
		</li>
        <li id="D2">
			<div class="top"><span>D</span><span>&hearts;</span></div>
			<h1>&hearts;</h1>
			<div class="bottom"><span>&hearts;</span><span>D</span></div>
		</li>
        <li id="D3">
			<div class="top"><span>D</span><span>&diams;</span></div>
			<h1>&diams;</h1>
			<div class="bottom"><span>&diams;</span><span>D</span></div>
		</li>
        <li id="D4">
			<div class="top"><span>D</span><span>&clubs;</span></div>
			<h1>&clubs;</h1>
			<div class="bottom"><span>&clubs;</span><span>D</span></div>
		</li>
    </ul>
         </div>
      )
   }
}
ReactDOM.render(
   <App />,
   document.querySelector('#root')
)