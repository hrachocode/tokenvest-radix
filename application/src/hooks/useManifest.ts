import { CMS_API, CMS_PRODUCTS, DEFAULT_RAISED_AMOUNT } from "@/constants/cms";
import { GATEWAY_URL, GATEWAY_URL_RESOURCES, GATEWAY_URL_DETAILS, PACKAGE_ID, TRANSACTION_SUCCESSFUL } from "@/constants/radix";
import { IProduct } from "@/interfaces/cmsInterface";
import { ITransactionRes } from "@/interfaces/radixInterface";
import { handleRequest, METHODS } from "@/utils/handleRequest";
import { createProductManifest, investManifest } from "@/utils/manifest";
import { useAccounts } from "./useAccounts";
import { useSendTransaction } from "./useSendTransaction";


export const useManifest = () => {
    const accounts = useAccounts();
    const sendTransaction = useSendTransaction();

    const createProduct = async (title: string, description: string, raiseAmount: string) => {
        const transactionRes = await sendTransaction(createProductManifest(PACKAGE_ID, raiseAmount, title, accounts[0].address));
        const transactionInfo = await handleRequest(GATEWAY_URL, METHODS.POST, {
            "transaction_identifier": {
                "type": "intent_hash",
                "value_hex": (transactionRes as ITransactionRes).value.transactionIntentHash
            }
        });
        if (transactionInfo.transaction.transaction_status === TRANSACTION_SUCCESSFUL) {
            await handleRequest(`${CMS_API}${CMS_PRODUCTS}`, METHODS.POST, {
                "data": {
                    "title": title,
                    "description": description,
                    "raiseAmount": raiseAmount,
                    "raisedAmount": DEFAULT_RAISED_AMOUNT,
                    "componentId": transactionInfo.details.referenced_global_entities[0],
                    "ownerAddress": accounts[0].address
                }
            })
        }
    };

    const invest = async (investAmount: string, product: IProduct) => {
        const resourcesData = await handleRequest(GATEWAY_URL_RESOURCES, METHODS.POST, {
            "address": accounts[0].address
        })
        const resources = resourcesData.fungible_resources.items;
        await resources.forEach(async (item: { address: string }) => {
            const resourceDetails = await handleRequest(GATEWAY_URL_DETAILS, METHODS.POST, {
                "address": item.address
            });
            resourceDetails.metadata.items.forEach(async (item: { value: string }) => {
                if (item.value === "Radix") {
                    const radixAddress = resourceDetails.address;
                    const transactionRes = await sendTransaction(investManifest(accounts[0].address, investAmount, radixAddress, product.componentId));
                    const transactionInfo = await handleRequest(GATEWAY_URL, METHODS.POST, {
                        "transaction_identifier": {
                            "type": "intent_hash",
                            "value_hex": (transactionRes as ITransactionRes).value.transactionIntentHash
                        }
                    });
                    const amount = transactionInfo.details.receipt.output[3].data_json;
                    if (transactionInfo.transaction.transaction_status === TRANSACTION_SUCCESSFUL) {
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