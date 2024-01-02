const ethers = require('ethers');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const vestingUrl = "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=4993830&toBlock=latest&address=0xD43b86CD7ccD89cb127F028E47A1F9d51029Eba8&topic0=0xcf2fafad2e64ab2802e3c57893f71b2645379029535db982282b4b24f4ff567a&apikey=KAARQNGPHECZ2WET981J24YBWZ4NUMCNSZ"
const vestingAbi = [{ "inputs": [{ "internalType": "address", "name": "tokenContract", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "releaseTime", "type": "uint256" }], "name": "LogLockBoxDeposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "LogLockBoxWithdrawal", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "releaseTime", "type": "uint256" }], "name": "deposit", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "emergencyWithdrawal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getAllLockboxDetails", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "address[]", "name": "", "type": "address[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }], "name": "getBeneficiaryIds", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }], "name": "getBeneficiaryLockboxes", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "lockBoxNumber", "type": "uint256" }], "name": "getLockboxDetail", "outputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "releaseTime", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "lockBoxStructs", "outputs": [{ "internalType": "address", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "releaseTime", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "lockBoxNumber", "type": "uint256" }], "name": "withdraw", "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]

const staking180url = "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=4993830&toBlock=latest&address=0x490D5B3CDf9f76ef743ad9B69FAf25369aCdf425&topic0=0x1449c6dd7851abc30abf37f57715f492010519147cc2652fbc38202c18a6ee90&apikey=KAARQNGPHECZ2WET981J24YBWZ4NUMCNSZ"
const staking360url = "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=4993830&toBlock=latest&address=0xeefcC23f432a2543DEC0C687b56dcD33Be7909aB&topic0=0x1449c6dd7851abc30abf37f57715f492010519147cc2652fbc38202c18a6ee90&apikey=KAARQNGPHECZ2WET981J24YBWZ4NUMCNSZ"
const staking720url = "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=4993830&toBlock=latest&address=0x6D94973603F31F85241604EdB15f2b7373478D52&topic0=0x1449c6dd7851abc30abf37f57715f492010519147cc2652fbc38202c18a6ee90&apikey=KAARQNGPHECZ2WET981J24YBWZ4NUMCNSZ"
const stakingAbi = [{ "inputs": [{ "internalType": "address", "name": "tokenAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Burned", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Minted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "period", "type": "uint256" }], "name": "Staked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "penalty", "type": "uint256" }], "name": "TotalWithdraw", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "balance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balances", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "earned", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "estimatedReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getAllAssets", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getStakingOverview", "outputs": [{ "internalType": "uint256", "name": "_rewardYearlyRate", "type": "uint256" }, { "internalType": "uint256", "name": "_rewardsEligible", "type": "uint256" }, { "internalType": "uint256", "name": "_daysLeft", "type": "uint256" }, { "internalType": "uint256", "name": "_deposited", "type": "uint256" }, { "internalType": "uint256", "name": "_penalty", "type": "uint256" }, { "internalType": "uint256", "name": "_allAllocations", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getUserPenalty", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isPeriodFinished", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "period", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewardRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "rewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakeType", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
// Vesting file 
async function getAndDecodeVestingLogs() {
    try {
        const response = await axios.get(vestingUrl);
        const logs = response.data.result;
        const iface = new ethers.Interface(vestingAbi);
        const csvRows = [['Address', 'Amount', 'Release Time']];

        logs.forEach(log => {
            const created = moment.unix(log.timeStamp).format('DD.MM.YYYY');
            const decoded = iface.parseLog({ topics: log.topics, data: log.data });
            const sender = decoded.args[0];
            const amount = ethers.formatUnits(decoded.args[1], 18);
            let releaseTime;
            if (typeof decoded.args[2] === 'number') {
                releaseTime = moment.unix(decoded.args[2]).format('DD.MM.YYYY');
            } else if (BigInt.prototype.isPrototypeOf(decoded.args[2])) {
                releaseTime = moment.unix(Number(decoded.args[2])).format('DD.MM.YYYY');
            } else {
                releaseTime = moment.unix(parseInt(decoded.args[2])).format('DD.MM.YYYY');
            }
            csvRows.push([created, sender, amount, releaseTime]);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        fs.writeFileSync('export/vesting.csv', csvContent);
        console.log('Vesting CSV file created successfully.');
    } catch (error) {
        console.error("Error:", error);
    }
}

async function getAndDecodeStakingLogs() {
    try {
        const res1 = await axios.get(staking180url);
        wait(1000);
        const res2 = await axios.get(staking360url);
        wait(1000);
        const res3 = await axios.get(staking720url);
        const logs = res1.data.result.concat(res2.data.result).concat(res3.data.result);
        const iface = new ethers.Interface(stakingAbi);
        const csvRows = [['Created','Address', 'Amount', 'Release date', 'Contract']];
        const uniqueAddresses = new Set();
        logs.forEach(log => {
            const created = moment.unix(log.timeStamp).format('DD.MM.YYYY');
            const decoded = iface.parseLog({ topics: log.topics, data: log.data });
            const sender = decoded.args[0];
            const amount = ethers.formatUnits(decoded.args[1], 18);
            const contractAddress = log.address.toLowerCase();
            
            let addressAlias
            if (contractAddress.toLowerCase() === '0x490d5b3cdf9f76ef743ad9b69faf25369acdf425') {
                addressAlias = '180'
            } else if (contractAddress.toLowerCase() === '0xeefcc23f432a2543dec0c687b56dcd33be7909ab') {
                addressAlias = '360'
            }
            else if (contractAddress.toLowerCase() === '0x6d94973603f31f85241604edb15f2b7373478d52') {
                addressAlias = '720'
            }
            else {
                addressAlias = ''
            }
            let lockUntil;
            if (typeof decoded.args[2] === 'number') {
                lockUntil = moment.unix(decoded.args[2]).format('DD.MM.YYYY');
            } else if (BigInt.prototype.isPrototypeOf(decoded.args[2])) {
                lockUntil = moment.unix(Number(decoded.args[2])).format('DD.MM.YYYY');
            } else {
                lockUntil = moment.unix(parseInt(decoded.args[2])).format('DD.MM.YYYY');
            }
            csvRows.push([created, sender, amount, lockUntil, addressAlias]);
            uniqueAddresses.add(sender);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        fs.writeFileSync('export/staking.csv', csvContent);
        console.log('Staking CSV file created successfully.');
        fs.writeFileSync('export/addresses.txt', Array.from(uniqueAddresses).join(','));
        console.log('Addresses TXT file created successfully.');
    } catch (error) {
        console.error("Error:", error);
    }
}

getAndDecodeStakingLogs().then(() => getAndDecodeVestingLogs());


