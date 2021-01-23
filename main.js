const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const Extract = require('@iota/extract-json');

// Connect to a node
const iota = Iota.composeAPI({
    // provider: 'https://nodes.devnet.thetangle.org:443',
    provider: 'https://nodes.thetangle.org:443',
});

const depth = 3;
const minimumWeightMagnitude = 14;

// Define a seed and an address.
// These do not need to belong to anyone or have IOTA tokens.
// They must only contain a mamximum of 81 trytes or 90 trytes with a valid checksum
const address = 'HEQLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99D';
const seed = 'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';

// Define a JSON message to send. This message must include only ASCII characters.
const message = JSON.stringify({ message: 'Hello World!' });
const messageInTrytes = Converter.asciiToTrytes(message);

// Define a zero-value transaction object that sends the message to the address
const transfers = [
    {
        value: 0,
        address,
        message: messageInTrytes,
    }
];

// Create a bundle from the `transfers` array and send the transaction to the node
iota.prepareTransfers(seed, transfers)
    .then(trytes => iota.sendTrytes(trytes, depth, minimumWeightMagnitude))
    .then(bundle => {
        // The message can be read from the Tangle, using the tail transaction hash
        const tailTransactionHash = bundle[0].hash;
        console.log(tailTransactionHash);

        // Get the tail transaction's bundle from the Tangle
        return iota.getBundle(tailTransactionHash).then(bundle => {
            // Get your hello world message from the transaction's `signatureMessageFragment` field and print it to the console
            console.log(JSON.parse(Extract.extractJson(bundle)));
        })
    })
    .catch(err => {
        console.log(err);
    });
