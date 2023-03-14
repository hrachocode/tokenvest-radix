import { products } from "@/constants/products"
import { Typography } from "@mui/material";
import { GetStaticPropsContext } from "next";

export async function getStaticPaths(){
    const paths = products.map((item)=>{
        return {
            params:{
                id: (item.id + 1).toString()
            }
        }
    });

    return { paths, fallback: false };

}

export async function getStaticProps(context: GetStaticPropsContext){
    return {
        props:{
            id: Number(context.params?.id) - 1
        }
    }
};

interface IProduct{
    id: number;
    title: string;
    description: string;
    amountToRaise:number,
    amountRaised:number,
}

export default function Product({id}: IProduct) {    
    return (
        <>
            <Typography>Product id: {id}</Typography>
        </>
    )
};
