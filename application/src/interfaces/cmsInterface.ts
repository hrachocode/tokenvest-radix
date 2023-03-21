export interface ICMSProduct {
    id: string;
    attributes: {
        title: string;
        description: string;
        raiseAmount: string;
        raisedAmount: string;
        componentId:string;
        ownerAddress:string;
        ownerResource:string;
    }
}
export interface IProduct {
    id: string;
    title: string;
    description: string;
    raiseAmount: string;
    raisedAmount: string;
    componentId: string;
    ownerAddress: string;
    ownerResource:string;
}
