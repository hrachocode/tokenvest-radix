import { styles } from '@/styles/CreateProduct.styles';
import { Box, Button, Input, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';


export default function CreateProduct() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [raiseAmount, setRaiseAmount] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, func: Function) => {
        func(e.target.value);
    };

    const alertProduct = () => {
        alert(`
        title: ${title}
        description: ${description}
        Raise Amount:${raiseAmount}
        `)
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
                    onClick={alertProduct}
                >CREATE A PRODUCT</Button>
            </Box>
        </>
    )
};