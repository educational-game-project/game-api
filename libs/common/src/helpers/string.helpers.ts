export const StringHelper = {
    internalServerError: 'internal_server_error',

    capitalize: (str: string, all: boolean = false): string => {
        str = str.toLocaleLowerCase();
        if (all) return str.split(' ').map(s => StringHelper.capitalize(s)).join(' ');
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    regexInsensitive(word: string) {
        return new RegExp(`^${word}$`, 'i');
    },

    validationResponse(section: string, field: string, rule: string, value?: string) {
        return `${section}_${field}_${rule}${value ? ' ' + value : ''}`;
    },

    notFoundResponse(value: string) {
        return `${value}_not_found`;
    },

    notAvaliableResponse(value: string) {
        return `${value}_not_avaliable`;
    },

    existResponse(value: string) {
        return `${value}_already_exist`;
    },

    expiredResponse(value: string) {
        return `${value}_expired`;
    },

    successResponse(section: string, method: string) {
        return `${section}_${method}_success`
    },

    // date time format: 2020-12-31T23:59:59.999Z utc to locale in 26 Jun '23 12 PM
    formatDateTime(date: string, timeZone: string = 'Asia/Jakarta'): string {
        const d = new Date(date);
        d.toLocaleString('en-US', { timeZone: timeZone })
        const month = d.toLocaleString('default', { month: 'short' });
        const day = d.getDate();
        const year = d.getFullYear();
        const hour = d.getHours();
        const minute = d.getMinutes();
        const ampm = hour >= 12 ? 'PM' : 'AM';

        return `${day} ${month} '${year.toString().substr(-2)} ${hour % 12}:${minute} ${ampm}`;
    },

    formatDate(date: string, timeZone: string = 'Asia/Jakarta'): string {
        const d = new Date(date);
        d.toLocaleString('en-US', { timeZone: timeZone })
        const month = d.toLocaleString('default', { month: 'short' });
        const day = d.getDate();
        const year = d.getFullYear();

        return `${day} ${month} '${year.toString().substr(-2)}`;
    },
};