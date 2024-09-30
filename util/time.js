exports.isBetween = (time, start, end) => {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setHours(start.split(":")[0], start.split(":")[1], 0, 0);
    endDate.setHours(end.split(":")[0], end.split(":")[1], 0, 0);

    return time >= startDate && time <= endDate;
};

exports.isBetweenWithDuration = (time, duration, start, end) => {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setHours(start.split(":")[0], start.split(":")[1], 0, 0);
    endDate.setHours(end.split(":")[0], end.split(":")[1], 0, 0);
    timeEnd = new Date(time);
    timeEnd.setMinutes(timeEnd.getMinutes() + duration);

    return (
        (time >= startDate && time <= endDate) ||
        (startDate >= time && startDate <= timeEnd)
    );
};
