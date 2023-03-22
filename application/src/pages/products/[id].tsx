import { CMS_API, CMS_PRODUCTS } from "@/constants/cms";
import { useAccounts } from "@/hooks/useAccounts";
import { useManifest } from "@/hooks/useManifest";
import { ICMSProduct, IProduct } from "@/interfaces/cmsInterface";
import { styles } from "@/styles/Products.styles";
import { Button, Input, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { ChangeEvent, useEffect, useState } from "react";

export async function getStaticPaths() {

    const res = await fetch(`${CMS_API}${CMS_PRODUCTS}`);
    const data = await res.json()

    const paths = data.data.map((item: ICMSProduct) => {
        return {
            params: {
                id: item.id.toString()
            }
        }
    });

    return { paths, fallback: false };

}

export async function getStaticProps(context: GetStaticPropsContext) {

    const res = await fetch(`${CMS_API}${CMS_PRODUCTS}/${context.params?.id}?populate=*`);
    const data = await res.json();

    const product: IProduct = {
        id: data.data.id,
        title: data.data.attributes.title,
        description: data.data.attributes.description,
        raiseAmount: data.data.attributes.raiseAmount,
        raisedAmount: data.data.attributes.raisedAmount,
        componentId: data.data.attributes.componentId,
        ownerAddress: data.data.attributes.ownerAddress,
        ownerResource: data.data.attributes.ownerResource,
        complete: data.data.attributes.complete
    }

    return {
        props: {
            product
        }
    }
};

export default function Product({ product }: { product: IProduct }) {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    })


    const [investAmount, setInvestAmount] = useState("0");
    const accounts = useAccounts();

    const { invest, withdraw } = useManifest();

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setInvestAmount(e.target.value);
    }

    const handleClick = () => {
        invest(investAmount, product);
    }

    const handleWithdraw = () => {
        withdraw(product);
    }



    return (
        <>
            <Typography>Product title: {product.title}</Typography>
            <Typography>Product description: {product.description}</Typography>
            <Typography>Product id: {product.id}</Typography>
            <Typography>Raise goal: {product.raiseAmount}</Typography>
            <Typography>Amount raised: {product.raisedAmount}</Typography>
            {!product.complete ?
                <>
                    <Input type='number' onChange={handleChange} />
                    <Button onClick={handleClick}>invest</Button>
                    {mounted && (product.ownerAddress === accounts?.[0]?.address) &&
                        <Button onClick={handleWithdraw}>withdraw</Button>}
                </> :
                <>
                <Typography sx={styles.finishedText}>Finished</Typography>
                </>
            }
        </>
    )
};
