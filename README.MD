# Preconditions
## 1. Install Visual Studio Code and Node.js
https://code.visualstudio.com/
https://nodejs.org/en
## 2. Clone this repository
`git clone https://github.com/xkazm04/proz-script` 
## 3. Install dependencies
type in terminal
`cd proz-script`
`npm install`

# Running the script
`node script.js`

This will generate files staking.csv and vesting.csv in the directory /export

## Example outputs
### Vesting
```csv
Vesting Address,Amount,Release Time
0x66F9bDdF62aCdE30b01041Fad528F378D14363c8,1000.0,27.02.2023
```

### Staking
```csv
Created,Address,Amount,Release date,Contract
27.02.2023,0x99098c56ACAb7B814aade17658987380ceD51B19,0.0,26.08.2023,180
```

### Addresses
List of unique addresses in all staking contracts (airdrop eligibility)

```text
0x99098c56ACAb7B814aade17658987380ceD51B19,0x66F9bDdF62aCdE30b01041Fad528F378D14363c8
```

## Support
Script uses BSCScan API for data retrieval, in case of invalid API key it is needed to sign in https://bscscan.com/myapikey and replace the key in the script.js file.