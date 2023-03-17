import { useAccounts } from '@/hooks/useAccounts';
import { useSendTransaction } from '@/hooks/useSendTransaction';
import { styles } from '@/styles/CreateProduct.styles';
import { Box, Button, Input, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';


export default function CreateProduct() {

    const packageId = "package_tdx_b_1q9qh3mt62jev6tptrfajg8tmmurg9749yygz5qdrrdcsqxkrx3";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [raiseAmount, setRaiseAmount] = useState("");
    const sendTransaction = useSendTransaction();
    const accounts = useAccounts();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, func: Function) => {
        func(e.target.value);
    };


    const handleTransaction = async () => {
        const transactionId = await sendTransaction(`
CALL_FUNCTION
    PackageAddress("${packageId}")
    "Investment"
    "new"
    Decimal("${raiseAmount}")
    "${title}";
CALL_METHOD
    ComponentAddress("${accounts[0].address}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");    
`);
        const data = await fetch("https://nebunet-gateway.radixdlt.com/transaction/committed-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "transaction_identifier": {
                    "type": "intent_hash",
                    "value_hex": (transactionId as any).value.transactionIntentHash
                }
            })
        });
        const result = await data.json();
        console.log(result,"data in timeout");
    };

    return (
        <>
            <Box sx={styles.wrapper}>
                <Box>
                    <Typography>Product Title</Typography>
                    <Input onChange={(e) => { handleChange(e, setTitle) }} />
                </Box>
                <Box>
                    <Typography>Product Description</Typography>
                    <Input
                        sx={styles.descInput}
                        multiline
                        onChange={(e) => { handleChange(e, setDescription) }} />
                </Box>
                <Box>
                    <Typography>Raise Amount</Typography>
                    <Input type='number' onChange={(e) => { handleChange(e, setRaiseAmount) }} />
                </Box>
                <Button
                    sx={styles.button}
                    variant='contained'
                    onClick={handleTransaction}
                >CREATE A PRODUCT</Button>
            </Box>
        </>
    )
};
