import { useEffect, useMemo } from "react";

interface WalletBalance {
	currency: string;
	amount: number;
}
interface FormattedWalletBalance {
	currency: string;
	amount: number;
	formatted: string;
}

class Datasource {
	// TODO: Implement datasource class

}

interface Props {
	datasource: Datasource;
}

const WalletPage: React.FC<Props> = (props) => {
	const { children, ...rest } = props;
	const balances = useWalletBalances();
	const [prices, setPrices] = useState({});

    // Inefficiency: Creating a new Datasource instance in every component render.
    // Consider initializing it outside the component if it doesn't maintain state.
	useEffect(() => {
		const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    	// Error Handling: Missing error handling for the async operation.
		datasource.getPrices().then(prices => {
			setPrices(prices);
		}).catch(error => {
			// Typo Fixed: It should be console.error instead of console.err
			console.err(error);
		});
	}, []);

	const getPriority = (blockchain: any): number => {
		// Efficiency: Replace switch statement with an object map for better performance.
		// Object maps are more efficient for lookup operations compared to switch statements.
		switch (blockchain) {
			case 'Osmosis':
				return 100
			case 'Ethereum':
				return 50
			case 'Arbitrum':
				return 30
			case 'Zilliqa':
				return 20
			case 'Neo':
				return 20
			default:
				return -99
		}
	}

	// useMemo Usage: useMemo is correctly used for memoizing sorted balances.
	// However, 'prices' in the dependency array is unnecessary if it's not used in the calculation.
	const sortedBalances = useMemo(() => {
		return balances.filter((balance: WalletBalance) => {
			const balancePriority = getPriority(balance.blockchain);
			// Mistake: lhsPriority variable is not defined anywhere.
			if (lhsPriority > -99) {
				if (balance.amount <= 0) {
					return true;
				}
			}
			return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
			const rightPriority = getPriority(rhs.blockchain);
			if (leftPriority > rightPriority) {
				return -1;
			} else if (rightPriority > leftPriority) {
				return 1;
			}
		});
	}, [balances, prices]); // Incorrect dependency: prices not used in the calculation.

	// Redundant Mapping: This operation can be done inline while rendering.
	const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
		return {
			...balance,
			formatted: balance.amount.toFixed()
		}
	})

	// Using Index as Key: Using index as key in React lists can cause rendering issues, especially with dynamic lists.
  	// It's recommended to use a unique and stable identifier as key.
	const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
		// Error Handling: There should be a check if the currency exists in prices to avoid runtime errors
		const usdValue = prices[balance.currency] * balance.amount;
		return (
			<WalletRow
				className={classes.row}
				key={index}
				amount={balance.amount}
				usdValue={usdValue}
				formattedAmount={balance.formatted}
			/>
		)
	})

	return (
		<div {...rest}>
			{rows}
		</div>
	)
}

export default WalletPage;
