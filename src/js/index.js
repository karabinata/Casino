import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'
class App extends React.Component {
   constructor(props){
      super(props)
      this.state = {
         lastWinner: 0,
         numberOfBets: 0,
         minimumBet: 0,
         totalBet: 0,
         maxAmountOfBets: 0,
      }
if(typeof web3 != 'undefined'){
         console.log("Using web3 detected from external source like Metamask")
         this.web3 = new Web3(web3.currentProvider)
      }else{
         console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
         this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
      }
const MyContract = web3.eth.contract([
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
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
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
      this.state.ContractInstance = MyContract.at("0x2F17B24e81dE8a2dCc85961BFb7873e99cbCF004")
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
   }

   setupListeners() {
      let numberNodes = this.refs.numbers.querySelectorAll('li')
      numberNodes.forEach(number => {
         number.addEventListener('click', event => {
            event.target.className = 'number-selected'
            let betSymbols = event.target.innerHTML.split('')
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
            <h1>Bet for your best number and win huge amounts of Ether</h1>
<div className="block">
               <b>Number of bets:</b> &nbsp;
               <span>{this.state.numberOfBets}</span>
            </div>
<div className="block">
               <b>Last number winner:</b> &nbsp;
               <span>{this.state.lastWinner}</span>
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
               <b>Max amount of bets:</b> &nbsp;
               <span>{this.state.maxAmountOfBets} ether</span>
            </div>
<hr/>
<h2>Vote for the next number and color</h2>
    <label>
        <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBet}/></b> ether
        <br/>
    </label>
   <ul ref="numbers">
        <li>A1</li>
        <li>K1</li>
        <li>Q1</li>
        <li>D1</li>
    </ul>
         </div>
      )
   }
}
ReactDOM.render(
   <App />,
   document.querySelector('#root')
)