import { CMS_API, CMS_PRODUCTS } from "@/constants/cms";
import { useManifest } from "@/hooks/useManifest";
import { ICMSProduct, IProduct } from "@/interfaces/cmsInterface";
import { Button, Input, Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { ChangeEvent, useState } from "react";

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
        componentId: data.data.attributes.componentId
    }

    return {
        props: {
            product
        }
    }
};

export default function Product({ product }: { product: IProduct }) {


    const [investAmount, setInvestAmount] = useState("0");

    const { invest } = useManifest();

    const handleChange = (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>{
        setInvestAmount(e.target.value);
    }

    const handleClick = () => {
        invest(investAmount, product);
    }



    return (
        <>
            <Typography>Product title: {product.title}</Typography>
            <Typography>Product description: {product.description}</Typography>
            <Typography>Product id: {product.id}</Typography>
            <Typography>Raise goal: {product.raiseAmount}</Typography>
            <Typography>Amount raised: {product.raisedAmount}</Typography>
            <Input type='number' onChange={handleChange} />
            <Button onClick={handleClick}>invest</Button>
        </>
    )
};
