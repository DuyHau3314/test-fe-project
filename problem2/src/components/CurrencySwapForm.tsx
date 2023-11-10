import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
    TextField,
    Card,
    MenuItem,
    CardContent,
    Grid,
    Box,
} from '@mui/material';
import useEffectOnce from '../hooks/useEffectOnce';
import { Token, getTokensPriceApi } from '../api/tokenPrice';


const CurrencySwapForm = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [fromToken, setFromToken] = useState('');
    const [toToken, setToToken] = useState('');
    const [amount, setAmount] = useState('');
    const [convertedAmount, setConvertedAmount] = useState<number>(0);

    // Errors state
    const [amountError, setAmountError] = useState<string>('');
    const [tokenError, setTokenError] = useState<{
        fromToken: boolean;
        toToken: boolean;
    }>({
        fromToken: false,
        toToken: false,
    });

    useEffectOnce(() => {
        const getTokens = async () => {
            const data = await getTokensPriceApi();
            setTokens(data)
        }

        getTokens();
    });

    const convertTokenAmount = useCallback((fromToken: string, toToken: string, amount: number) => {
        const fromTokenPrice = tokens.find(token => token.currency === fromToken)?.price;
        const toTokenPrice = tokens.find(token => token.currency === toToken)?.price;

        if(!fromTokenPrice || !toTokenPrice) return 0;

        const amountInBaseCurrency = amount * fromTokenPrice;
        return amountInBaseCurrency / toTokenPrice;
    }, [tokens])

    useEffect(() => {
        if(!amount) return;
        if(!fromToken && !toToken) {
            setTokenError((prevState) => ({ ...prevState, fromToken: !fromToken, toToken: !toToken }));
            setConvertedAmount(0);
            return;
        }

        if (!fromToken) {
            setTokenError((prevState) => ({ ...prevState, fromToken: true, toToken: false }));
            setConvertedAmount(0);
            return;
        } else {
            setTokenError((prevState) => ({ ...prevState, fromToken: false }));
        }

        if (!toToken) {
            setTokenError((prevState) => ({ ...prevState, fromToken: false, toToken: true }));
            setConvertedAmount(0);
            return;
        } else {
            setTokenError((prevState) => ({ ...prevState, toToken: false }));
        }

        if (isNaN(Number(amount))) {
            setAmountError('Invalid number');
            setConvertedAmount(0);
            return;
        } else {
            setAmountError('');
            const convertToken = convertTokenAmount(fromToken, toToken, Number(amount)) ?? 0;
            setConvertedAmount(convertToken);
        }
    }, [amount, convertTokenAmount, fromToken, toToken, tokens]);


    const handleSwap = () => {
        // Swap logic to calculate convertedAmount
        setFromToken(toToken);
        setToToken(fromToken);
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value || /^[0-9]*\.?[0-9]*$/.test(value)) { // Allow only numbers and decimal points
            setAmount(value);
        }
    };

    // Function to dynamically import SVG based on the token name
    const getTokenIcon = (token: string) => {
        return `/tokens/${token}.svg`;
    };

    // Calculate conversion rate for display
    const conversionRate = convertTokenAmount(fromToken, toToken, 1);

    // Custom rendering for TextField value
    const renderValue = (token: string) => (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            {token}
            <img src={getTokenIcon(token)} alt={token} style={{ width: '20px', marginRight: '10px' }} />
        </Box>
    );

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Card style={{ width: '600px' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5.5}>
                            <TextField
                                select
                                label="From"
                                value={fromToken}
                                onChange={(e) => setFromToken(e.target.value)}
                                fullWidth
                                helperText={tokenError.fromToken ? "Please select from token" : ""}
                                error={tokenError.fromToken}
                                SelectProps={{
                                    renderValue: fromToken ? () => renderValue(fromToken) : undefined,
                                }}
                            >
                                {tokens.map((token) => (
                                    <MenuItem
                                        key={token.id}
                                        value={token.currency}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {token.currency}
                                        <img
                                            src={getTokenIcon(token.currency)}
                                            alt={token.currency}
                                            width="20"
                                            style={{ marginRight: '10px' }}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={1}>
                            <SwapHorizIcon style={{ alignSelf: 'center', cursor: 'pointer' }} onClick={handleSwap} />
                        </Grid>

                        <Grid item xs={5.5}>
                            <TextField
                                select
                                label="To"
                                value={toToken}
                                onChange={(e) => setToToken(e.target.value)}
                                fullWidth
                                error={tokenError.toToken}
                                helperText={tokenError.toToken ? "Please select to token" : ""}
                                SelectProps={{
                                    renderValue: toToken ? () => renderValue(toToken) : undefined,
                                }}
                            >
                                {tokens.map((token) => (
                                    <MenuItem
                                        key={token.id}
                                        value={token.currency}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {token.currency}
                                        <img
                                            src={getTokenIcon(token.currency)}
                                            alt={token.currency}
                                            width="20"
                                            style={{ marginRight: '10px' }}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Amount"
                                value={amount}
                                onChange={handleAmountChange}
                                fullWidth
                                helperText={amountError || (!fromToken || !toToken ?
                                    "Enter amount and select both tokens to see the rate" :
                                    `1 ${fromToken} = ${conversionRate} ${toToken}`)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Converted Amount"
                                value={convertedAmount}
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                helperText="Converted amount based on current rate"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default CurrencySwapForm;
