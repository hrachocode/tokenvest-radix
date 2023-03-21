import { CMS_API, CMS_PRODUCTS, DEFAULT_RAISED_AMOUNT } from "@/constants/cms";
import { GATEWAY_URL, GATEWAY_URL_RESOURCES, GATEWAY_URL_DETAILS, PACKAGE_ID, TRANSACTION_SUCCESSFUL } from "@/constants/radix";
import { IProduct } from "@/interfaces/cmsInterface";
import { handleRequest, METHODS } from "@/utils/handleRequest";
import { createProductManifest, investManifest } from "@/utils/manifest";
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
        const transactionId = await sendTransaction(createProductManifest(PACKAGE_ID, raiseAmount, title, accounts[0].address));
        const result = await handleRequest(GATEWAY_URL, METHODS.POST, {
            "transaction_identifier": {
                "type": "intent_hash",
                "value_hex": (transactionId as ITransactionId).value.transactionIntentHash
            }
        });
        if (result.transaction.transaction_status === TRANSACTION_SUCCESSFUL) {
            await handleRequest(`${CMS_API}${CMS_PRODUCTS}`, METHODS.POST, {
                "data": {
                    "title": title,
                    "description": description,
                    "raiseAmount": raiseAmount,
                    "raisedAmount": DEFAULT_RAISED_AMOUNT,
                    "componentId": result.details.referenced_global_entities[0],
                    "ownerAddress": accounts[0].address
                }
            })
        }
    };

    const invest = async (investAmount: string, product: IProduct) => {
        const data = await handleRequest(GATEWAY_URL_RESOURCES, METHODS.POST, {
            "address": accounts[0].address
        })
        const resources = data.fungible_resources.items;
        await resources.forEach(async (item: { address: string }) => {
            const detailsRes = await handleRequest(GATEWAY_URL_DETAILS, METHODS.POST, {
                "address": item.address
            });
            detailsRes.metadata.items.forEach(async (item: { value: string }) => {
                if (item.value === "Radix") {
                    const radixAddress = detailsRes.address;
                    const transactionId = await sendTransaction(investManifest(accounts[0].address, investAmount, radixAddress, product.componentId));
                    const result = await handleRequest(GATEWAY_URL, METHODS.POST, {
                        "transaction_identifier": {
                            "type": "intent_hash",
                            "value_hex": (transactionId as ITransactionId).value.transactionIntentHash
                        }
                    });
                    const amount = result.details.receipt.output[3].data_json;
                    if (result.transaction.transaction_status === TRANSACTION_SUCCESSFUL) {
                        await handleRequest(`${CMS_API}${CMS_PRODUCTS}/${product.id}`, METHODS.PUT, {
                            "data": {
                                "raisedAmount": amount,
                            }
                        })
                    }
                }
            })
        })
    };


    return { createProduct, invest };
};