import { products } from '@/constants/products';
import { styles } from '@/styles/Products.styles';
import { Box, LinearProgress, Typography } from '@mui/material';
import { Fragment } from 'react';


export default function Products() {
    return (
        <>
            <Box sx={styles.productsWrapper}>
                {products.map((item, index) => {
                    return (
                        <Fragment key={index + 1}>
                            <Box sx={styles.productWrapper}>
                                <Box sx={styles.titleDescriptionBox}>
                                    <Typography sx={styles.title}>{item.title}</Typography>
                                    <Typography sx={styles.description}>{item.description}</Typography>
                                </Box>
                                <Box sx={styles.linearProgressWrapper}>
                                    <LinearProgress
                                        sx={styles.linearProgress}
                                        variant="determinate"
                                        value={item.amountRaised * 100 / item.amountToRaise} />
                                    <Typography sx={styles.raisedStatus}>{item.amountRaised} / {item.amountToRaise}</Typography>
                                </Box>
                            </Box>
                        </Fragment>
                    )
                })}
            </Box>
        </>
    )
};
