##Advanced Smart Contracts Individual Project
Project Name: Merkle Airdrop Token
Student Name: Malhar Dave

##Description
This is an Airdrop Token example that utilizes Merkle Trees to distribute tokens; an efficient alternative to traditional token airdrop practices, which are often an inadvertant source of nuisance for ethereum users. The smart contract has functionalities to set the Name, Symbol and Total Supply of the token along with the Merkle root hash. There are also getter functions for each of these, although the Merkle root hash getter function was only included for testing purposes. The primary function is the redeemToken function, which compares the input parameters of a recipient address with the root hash that emits a Transfer event and makes changes to the relevant state variables in a successful scenario.

##Testing
All functions of the smart contract were tested successfully. The Transfer was tested to ensure it emitted correctly, and changes to relevant state variables were verified.

##Gas Optimization
All modifiers were inlined, and function visibility was set to external wherever possible. A for loop inside the redeemToken function was unavoidable. Short circuiting was implemented for conditional statements, and repetitive checks were avoided. Lastly, state variables were left uninitialized.

##Security Considerations
Smart Contract code was analyzed using SmartDec tool. State variables were set to private. Reentrancy was addressed in the redeemToken function, where state changes were made before emitting the transfer event.

##How to Run

The smart contract was developed and tested using the truffle framework. Addresses, merkle root hash, and witness array have been hard coded in the test file so it should run successfully without any alterations.

Follow the steps below to run the contract:

1) npm install
2) To obtain a new Merkle root hash, first clear addresses.txt and paste your list of addresses. Then, type 'node recipient-tree.js root addresses.txt' in the command line to get root hash.
3) Type 'node recipient-tree.js proof addresses.txt <Address>' to get path and witness array for the given address.
4) Once deployed to truffle, call the DeployAirdrop function using the account that was used to deploy the function, and enter token details along with the root hash.
5) You can now call the other functions.
