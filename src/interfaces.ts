export interface INominee {
    name: string,
    extra_info: string,
}

export interface ICategory {
    name: string,
    nominees: INominee[],
    points: number,
    predictions: IPrediction[]
}

export interface IPrediction {
    prediction: number,
}


