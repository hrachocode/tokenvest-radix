import { GATEWAY_URL, PACKAGE_ID } from "@/constants/radix";
import { useAccounts } from "./useAccounts";
import { useSendTransaction } from "./useSendTransaction";

interface ITransactionId {
    value: {
        transactionIntentHash: string
    }
}

export const useManifest = () => {
    const accounts = useAccounts();
    const sendTransaction = useSendTransaction();

    const createProduct = async (title: string, raiseAmount: string) => {
        const transactionId = await sendTransaction(`
CALL_FUNCTION
    PackageAddress("${PACKAGE_ID}")
    "Investment"
    "new"
    Decimal("${raiseAmount}")
    "${title}";
CALL_METHOD
    ComponentAddress("${accounts[0].address}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");    
`);
        const data = await fetch(GATEWAY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "transaction_identifier": {
                    "type": "intent_hash",
                    "value_hex": (transactionId as ITransactionId).value.transactionIntentHash
                }
            })
        });
        const result = await data.json();
        return result;
    };
    return { createProduct };
};