const getBase64 = file => {
    return new Promise((resove, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resove(reader.result);
        };
        reader.onerror = error => reject(error);
    });
};
export default getBase64;
