const exchangeRate = 0.000043;

export const formatCurrencyUSD = amount => {
    const value = amount * exchangeRate;
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
};

export const formatCurrencyVND = value => {
    return value
        .toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })
        .replace(/\s/g, '');
};
