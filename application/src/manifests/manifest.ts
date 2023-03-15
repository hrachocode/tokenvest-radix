export const investManifest = () => {
    console.log(`
    CALL_METHOD ComponentAddress("account_tdx_b_1pzfkm2ycejjvr3ae8gxwjfx2t65hmj9j4hnkvw3h9xpq9qu4tu")
        "withdraw_by_amount"
        Decimal("5") ResourceAddress("resource_tdx_b_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8z96qp");
    TAKE_FROM_WORKTOP_BY_AMOUNT
        Decimal("5") ResourceAddress("resource_tdx_b_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8z96qp")
        Bucket("bucket1");
    CALL_METHOD
    ComponentAddress("component_tdx_b_1q2yyjgc76esnkuwhz5rnzlp47cyrxt9jysgzqt8s96fqem5gza")
        "invest"
        Bucket("bucket1")
        "walter";
    CALL_METHOD  ComponentAddress("account_tdx_b_1pzfkm2ycejjvr3ae8gxwjfx2t65hmj9j4hnkvw3h9xpq9qu4tu")
        "deposit_batch"
        Expression("ENTIRE_WORKTOP");
    `);  
};