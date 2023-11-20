export const TimeHelper = {
    getToday: () => {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }
}