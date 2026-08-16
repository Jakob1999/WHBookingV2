export function getDateAsString(date : Date) {
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }
    
    return date.toLocaleDateString(undefined, options)    
}