export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ msg: 'Method not allowed' });
    }

    const { amount } = req.query;

    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/ARS');
        const data = await response.json();
        const exchangeRate = data.rates.USD;
        const amountInUSD = (amount * exchangeRate)*1.5;
        return res.status(200).json({ convertedAmount: amountInUSD.toFixed(2) });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    }
}
