import { CMS_API, CMS_PRODUCTS } from "@/constants/cms";
import { ICMSProduct, IProduct } from "@/interfaces/cmsInterface";
import { Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";

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
        raisedAmount: data.data.attributes.raisedAmount
    }

    return {
        props: {
            product
        }
    }
};

export default function Product({ product }: { product: IProduct }) {
    return (
        <>
            <Typography>Product id: {product.id}</Typography>
            <Typography>Product title: {product.title}</Typography>
        </>
    )
};
