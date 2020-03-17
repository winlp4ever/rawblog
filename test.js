function getCurrentTime() {
    const t = new Date();
    const month = t.toLocaleString('default', { month: 'short' });
    const timeZoneOffset = parseInt(t.getTimezoneOffset()/(-60))
    return `${t.getDate()} ${month} ${t.getFullYear()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()} GMT${(timeZoneOffset>0? '+': '') + timeZoneOffset}`
}

console.log(getCurrentTime());