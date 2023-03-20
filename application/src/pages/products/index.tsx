import { PRODUCTS } from '@/constants/routes';
import { styles } from '@/styles/Products.styles';
import { Box, LinearProgress, Typography } from '@mui/material';
import Link from 'next/link';
import { Fragment } from 'react';
import { CMS_API, CMS_PRODUCTS } from '@/constants/cms';
import { ICMSProduct, IProduct } from '@/interfaces/cmsInterface';

export async function getStaticProps() {
    const res = await fetch(`${CMS_API}${CMS_PRODUCTS}`);
    const data = await res.json()

    const products: IProduct[] = data.data.map((item: ICMSProduct) => {
        return {
            id: item.id,
            title: item.attributes.title,
            description: item.attributes.description,
            raiseAmount: item.attributes.raiseAmount,
            raisedAmount: item.attributes.raisedAmount,
            componentId: item.attributes.componentId
        }
    });

    return {
        props: {
            products
        }
    }
}


export default function Products({ products }: { products: IProduct[] }) {
    if (products.length > 0) {
        return (
            <>
                <Box sx={styles.productsWrapper}>
                    {products.map((item, index) => {
                        return (
                            <Fragment key={index + 1}>
                                <Link href={`${PRODUCTS}/${item.id}`}>
                                    <Box sx={styles.product}>
                                        <Box sx={styles.titleDescriptionBox}>
                                            <Typography sx={styles.title}>{item.title}</Typography>
                                            <Typography sx={styles.description}>{item.description}</Typography>
                                        </Box>
                                        <Box sx={styles.linearProgressWrapper}>
                                            <LinearProgress
                                                sx={styles.linearProgress}
                                                variant="determinate"
                                                value={+item.raisedAmount * 100 / +item.raiseAmount} />
                                            <Typography sx={styles.raisedStatus}>{item.raisedAmount} / {item.raiseAmount}</Typography>
                                        </Box>
                                    </Box>
                                </Link>
                            </Fragment>
                        )
                    })}
                </Box>
            </>
        )
    } else {
        return (
            <>
                <Typography>No Products</Typography>
            </>
        )
    }

};
