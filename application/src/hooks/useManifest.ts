import { CMS_API, CMS_PRODUCTS } from "@/constants/cms";
import { GATEWAY_URL, GATEWAY_URL_RESOURCES, GATEWAY_URL_DETAILS, PACKAGE_ID, TRANSACTION_SUCCESSFUL } from "@/constants/radix";
import { IProduct } from "@/interfaces/cmsInterface";
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

    const createProduct = async (title: string, description: string, raiseAmount: string) => {
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
        if (result.transaction.transaction_status === TRANSACTION_SUCCESSFUL) {
            await fetch(`${CMS_API}${CMS_PRODUCTS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "data": {
                        "title": title,
                        "description": description,
                        "raiseAmount": raiseAmount,
                        "raisedAmount": "0",
                        "componentId": result.details.referenced_global_entities[0]
                    }
                })
            })
        }
        return result;
    };

    const invest = async (investAmount: string, product: IProduct) => {
        const res = await fetch(GATEWAY_URL_RESOURCES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "address": accounts[0].address
            })
        })
        const data = await res.json();
        const resources = data.fungible_resources.items;
        await resources.forEach(async (item: { address: string }) => {
            const details = await fetch(GATEWAY_URL_DETAILS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "address": item.address
                })
            });
            const detailsRes = await details.json();
            detailsRes.metadata.items.forEach(async (item: { value: string }) => {
                if (item.value === "Radix") {
                    const radixAddress = detailsRes.address;
                    const transactionId = await sendTransaction(`
CALL_METHOD
    ComponentAddress("${accounts[0].address}")
    "withdraw_by_amount"
    Decimal("${investAmount}")
    ResourceAddress("${radixAddress}");
TAKE_FROM_WORKTOP_BY_AMOUNT
    Decimal("${investAmount}")
    ResourceAddress("${radixAddress}")
    Bucket("bucket1");
CALL_METHOD
    ComponentAddress("${product.componentId}")
    "invest"
    Bucket("bucket1")
    "walter";
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
                    const amount = result.details.receipt.output[3].data_json;
                    if (result.transaction.transaction_status === TRANSACTION_SUCCESSFUL) {
                        await fetch(`${CMS_API}${CMS_PRODUCTS}/${product.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                "data": {
                                    "raisedAmount": amount,
                                }
                            })
                        })
                    }
                }
            })
        })





    };


    return { createProduct, invest };
};