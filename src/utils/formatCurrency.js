const exchangeRate = 0.000043;

export const formatCurrencyUSD = (amount = 0) => {
    const value = amount * exchangeRate;
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
};

export const formatCurrencyVND = (value = 0) => {
    return value
        .toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })
        .replace(/\s/g, '');
};
