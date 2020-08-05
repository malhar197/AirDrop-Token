const Airdrop = artifacts.require('./Airdrop.sol');
const truffleAssert = require('truffle-assertions');

contract('Airdrop',(accounts) => {
	let contract;

	before(async () => {
		contract = await Airdrop.deployed();
	})

	describe('Deployment', async() => {
		it('deploys successfully', async() => {
		contract = await Airdrop.deployed();
		const address = contract.address;
		console.log(address);
		assert.notEqual(address, '');
		assert.notEqual(address, 0x0);
		assert.notEqual(address, null);
		assert.notEqual(address, undefined);
		})
	})

	describe('Airdrop and getter functions', async() => {
		it('Throws an error if Airdrop function is accessed by non-owner', async() => {
			await truffleAssert.reverts(
			 contract.deployAirdrop('Airdrop','AD','0x290b05860246c97e3815536539837dd2615c24a8ba2e9a2a83444f4bbe49ccbe',10,1, {from: accounts[1]}),
			 "Can only be accessed by owner"
			 );
		})
		it('Airdrop function sets parameters successfully', async() => {
			let inputRootHash = '0x290b05860246c97e3815536539837dd2615c24a8ba2e9a2a83444f4bbe49ccbe';
			await contract.deployAirdrop('Airdrop','AD','0x290b05860246c97e3815536539837dd2615c24a8ba2e9a2a83444f4bbe49ccbe',10,1, {from: accounts[0]});
			let returnedRootHash = await contract.getRootHash();
			assert.equal(inputRootHash, returnedRootHash, ' Root Hash set successfully');
		})
		it('Name set successfully', async() => {
			let expectedName = 'Airdrop';
			let returnedName = await contract.getName();
			assert.equal(expectedName,returnedName, 'Name set successfully');
		})
		it('Symbol set successfully', async() => {
			let expectedSymbol = 'AD';
			let returnedSymbol = await contract.getSymbol();
			assert.equal(expectedSymbol,returnedSymbol, 'Symbol set successfully');
		})
		it('Total Supply set successfully', async() => {
			let expectedTotalSupply = 10;
			let returnedTotalSupply = await contract.getTotalSupply();
			assert.equal(expectedTotalSupply,returnedTotalSupply, 'Total Supply set successfully');
		})

	})

	describe('RedeemToken function', async() => {
		it('Emits event for successful transaction', async() => {
			let witnesses = ["0x9469c7d87de84def34590e6da71e2aeaf93e09c34a73f8cb37e8f6f4498f7b43","0x98ca3c03e740397843827130eac9798660c3109cc2469dfc39782b947e23a154","0xd08dbebb01bff9e861eec56bcd03631b9d177d721541f7e205f765f382e9c41c","0x6b4f8df3d459600697894a141d2357d00544abbcbd8f64d121fae7c731ad5869"];
			let redeem = await contract.redeemToken(1,'0xb51bC449f47A6488660803Ed9b0aFCaD4d6d3eb3', witnesses);
			truffleAssert.eventEmitted(redeem,'Transfer');
		})
		it('Ensures amount was added to recipient balance and subtracted from total supply', async() => {
			let recipientBalance = await contract.checkBalance('0xb51bC449f47A6488660803Ed9b0aFCaD4d6d3eb3');
			let expectedBalance = 1;
			assert.equal(recipientBalance,expectedBalance,'Balances match');
			let returnedTotalSupply = await contract.getTotalSupply();
			let expectedTotalSupply = 9;
			assert.equal(returnedTotalSupply,expectedTotalSupply,'Total Supply successfully updated');
		})
		it('Successfully reverts when an address tries to redeem again', async() => {
			let witnesses = ["0x9469c7d87de84def34590e6da71e2aeaf93e09c34a73f8cb37e8f6f4498f7b43","0x98ca3c03e740397843827130eac9798660c3109cc2469dfc39782b947e23a154","0xd08dbebb01bff9e861eec56bcd03631b9d177d721541f7e205f765f382e9c41c","0x6b4f8df3d459600697894a141d2357d00544abbcbd8f64d121fae7c731ad5869"];
			await truffleAssert.reverts(
				contract.redeemToken(1,'0xb51bC449f47A6488660803Ed9b0aFCaD4d6d3eb3', witnesses), "Recipient has already redeemed token" );
			
		})
	})

})