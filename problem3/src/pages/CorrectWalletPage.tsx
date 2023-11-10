import React, { useEffect, useState, useMemo } from 'react';
import WalletRow from './WalletRow'; // Import the WalletRow component

class Datasource {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async getPrices(): Promise<Record<string, number>> {
        const response = await fetch(this.url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
}

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface Props {
    datasource: Datasource;
}

const WalletPage: React.FC<Props> = ({ datasource, ...rest }) => {
    const balances = useWalletBalances(); // Assuming this is a custom hook
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        datasource.getPrices()
            .then(setPrices)
            .catch(err => {
                console.error(err);
                setError('Failed to load prices');
            });
    }, [datasource]);

    const getPriority = (blockchain: string): number => {
        const priorities: Record<string, number> = {
            'Osmosis': 100,
            'Ethereum': 50,
            'Arbitrum': 30,
            'Zilliqa': 20,
            'Neo': 20,
            'default': -99,
        };
        return priorities[blockchain] || priorities['default'];
    };

    const sortedBalances = useMemo(() => {
        return balances
            .filter(balance => balance.amount > 0)
            .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
    }, [balances]);

    const rows = sortedBalances.map((balance, index) => {
        const usdValue = (prices[balance.currency] || 0) * balance.amount;
        return (
            <WalletRow
                key={`${balance.currency}-${index}`}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.amount.toFixed(2)}
            />
        );
    });

    if (error) {
        return <div>Failed to load data</div>;
    }

    return (
        <div {...rest}>
            {rows.length > 0 ? rows : <div>No wallet balances available</div>}
        </div>
    );
};

export default WalletPage;
