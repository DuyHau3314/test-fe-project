import { v4 as uuidv4 } from 'uuid';

export interface Token {
    currency: string;
    date: Date;
    price: number;
    id: string;
}

const getTokensPriceApi = async () => {
	const response = await fetch('https://interview.switcheo.com/prices.json')
	const data = await response.json()
	if(!data) return []
	return data.map((item: Token) => ({...item, id: uuidv4()}))
}

export {
	getTokensPriceApi
}