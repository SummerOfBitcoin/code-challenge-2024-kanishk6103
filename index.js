const fs = require('fs');
const crypto = require('crypto');

const mempoolFolder = './mempool';
const difficultyTarget = '0000ffff00000000000000000000000000000000000000000000000000000000';

// Function to validate transactions
function validateTransaction(transaction) {
    // Check if transaction has required fields
    if (!transaction.txid || !transaction.inputs || !transaction.outputs) {
        return false;
    }

    // Check if transaction inputs and outputs are not empty
    if (transaction.inputs.length === 0 || transaction.outputs.length === 0) {
        return false;
    }

    // Additional validation logic...
    // For example, you might check:
    // - Whether inputs are valid unspent outputs
    // - Whether the sum of inputs is greater than or equal to the sum of outputs
    // - Whether signatures are valid

    // Placeholder for simplicity
    return true;
}

// Function to mine a block
function mineBlock(transactions) {
    let blockHeader = "Block header";
    let coinbaseTransaction = "Serialized coinbase transaction";
    let minedTransactions = [];

    // Add coinbase transaction
    minedTransactions.push(transactions[0].txid);

    // Validate and add transactions to block
    for (let i = 1; i < transactions.length; i++) {
        const transaction = transactions[i];
        if (validateTransaction(transaction)) {
            minedTransactions.push(transaction.txid);
        }
    }

    // Calculate nonce
    let nonce = 0;
    let blockHash = '';
    while (blockHash.substring(0, 16) !== difficultyTarget) {
        blockHash = crypto.createHash('sha256').update(blockHeader + nonce).digest('hex');
        nonce++;
    }

    // Write results to output.txt
    const output = `${blockHeader}\n${coinbaseTransaction}\n${minedTransactions.join('\n')}`;
    fs.writeFileSync('output.txt', output);
}

// Read mempool folder
let transactions = [];
fs.readdirSync(mempoolFolder).forEach(file => {
    const data = fs.readFileSync(`${mempoolFolder}/${file}`);
    transactions.push(JSON.parse(data));
});

// Sort transactions by fee (optional)
transactions.sort((a, b) => b.fee - a.fee);

// Mine block with valid transactions
mineBlock(transactions);
