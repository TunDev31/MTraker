export const formatCurrency = (value, localeString)=> {
    if (!value) return "0 VND"
    return value.toLocaleString(localeString)  +' VND';
}