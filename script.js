const ethers = require('ethers');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const vestingUrl = "https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=4993830&toBlock=latest&address=0xD43b86CD7ccD89cb127F028E47A1F9d51029Eba8&topic0=0xcf2fafad2e64ab2802e3c57893f71b2645379029535db982282b4b24f4ff567a&apikey=KAARQNGPHECZ2WET981J24YBWZ4NUMCNSZ"
const vestingAbi = [{"inputs":[{"internalType":"address","name":"tokenContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"releaseTime","type":"uint256"}],"name":"LogLockBoxDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"LogLockBoxWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"releaseTime","type":"uint256"}],"name":"deposit","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"emergencyWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllLockboxDetails","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"beneficiary","type":"address"}],"name":"getBeneficiaryIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"beneficiary","type":"address"}],"name":"getBeneficiaryLockboxes","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockBoxNumber","type":"uint256"}],"name":"getLockboxDetail","outputs":[{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"releaseTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lockBoxStructs","outputs":[{"internalType":"address","name":"beneficiary","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"releaseTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lockBoxNumber","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]


// Vesting file 
async function getAndDecodeVestingLogs() {
    try {
        const response = await axios.get(vestingUrl);
        const logs = response.data.result;
        const iface = new ethers.Interface(vestingAbi);

        const csvRows = [['Sender', 'Amount', 'Release Time']]; // CSV header

        logs.forEach(log => {
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
            csvRows.push([sender, amount, releaseTime]);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        fs.writeFileSync('vestingHistory.csv', csvContent);
        console.log('Vesting CSV file created successfully.');
    } catch (error) {
        console.error("Error:", error);
    }
}

getAndDecodeVestingLogs();