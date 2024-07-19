export const TimeHelper = {
  getToday: () => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  },

  CalculateTime(dob: Date, minutes?: boolean) {
    const dobDate = new Date(dob);
    //calculate month difference from current date in time  
    var month_diff = Date.now() - dobDate.getTime();

    //convert the calculated difference in date format  
    var age_dt = new Date(month_diff);
    //extract year from date      
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user  
    var age = Math.abs(year - 1970);
    var diffMins = Math.round(((month_diff % 86400000) % 3600000) / 60000);
    return minutes ? diffMins : age
  },
};
