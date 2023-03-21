export const createProductManifest = (packageId: string, raiseAmount: string, title: string, accountAddress: string) => {
    return `
CALL_FUNCTION
    PackageAddress("${packageId}")
    "Investment"
    "new"
    Decimal("${raiseAmount}")
    "${title}";
CALL_METHOD
    ComponentAddress("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");    
`
}

export const investManifest = (accountAddress:string,investAmount:string,radixAddress:string,componentId:string) => {
    return `
CALL_METHOD
    ComponentAddress("${accountAddress}")
    "withdraw_by_amount"
    Decimal("${investAmount}")
    ResourceAddress("${radixAddress}");
TAKE_FROM_WORKTOP_BY_AMOUNT
    Decimal("${investAmount}")
    ResourceAddress("${radixAddress}")
    Bucket("bucket1");
CALL_METHOD
    ComponentAddress("${componentId}")
    "invest"
    Bucket("bucket1")
    "walter";
CALL_METHOD
    ComponentAddress("${accountAddress}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");                  
`
}