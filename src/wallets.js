import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

// Contains a list of methods to send transactions via different wallet connectors

const sendPeraWalletTransaction = async (connector, txn, algodClient) => {
    // write your code here
};

const sendWalletConnectTransaction = async (connector, txn, algodClient) => {
    try {
        // Sign transaction
        // txns is an array of algosdk.Transaction like below
        // i.e txns = [txn, ...someotherTxns], but we've only built one transaction in our case
        const txns = [txn];
        const txnsToSign = txns.map((txn) => {
            const encodedTxn = Buffer.from(
                algosdk.encodeUnsignedTransaction(txn)
            ).toString("base64");

            return {
                txn: encodedTxn,
                message: "Description of transaction being signed",
                // Note: if the transaction does not need to be signed (because it's part of an atomic group
                // that will be signed by another party), specify an empty singers array like so:
                // signers: [],
            };
        });

        const requestParams = [txnsToSign];

        const request = formatJsonRpcRequest("algo_signTxn", requestParams);
        const result = await connector.sendCustomRequest(request);
        const decodedResult = result.map((element) => {
            return element
                ? new Uint8Array(Buffer.from(element, "base64"))
                : null;
        });

        const response = await algodClient
            .sendRawTransaction(decodedResult)
            .do();
        console.log(response);

        // wait for blockchain confirmation within 4 rounds
        await algosdk.waitForConfirmation(algodClient, response.txId, 4);

        return response;
    } catch (err) {
        console.error(err);
    }
};

const sendDeflyWalletTransaction = async (connector, txn, algodClient) => {
    // write your code here
};

const submitTxns = async (algodClient, signedTxnsData) => {
    // submit txn to chain and wait for confirmation
    const response = await algodClient.sendRawTransaction(signedTxnsData).do();

    await algosdk.waitForConfirmation(algodClient, response.txId, 4);

    return response;
};

export default {
    sendWalletConnectTransaction,
    sendPeraWalletTransaction,
    sendDeflyWalletTransaction,
};
