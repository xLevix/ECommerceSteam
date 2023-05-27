export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ msg: 'Method not allowed' });
    }

    const { amount } = req.body;

    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/ARS');
        const data = await response.json();
        const exchangeRate = data.rates.PLN;
        const amountInPLN = amount * exchangeRate;
        return res.status(200).json({ convertedAmount: amountInPLN.toFixed(2) });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    }
}
