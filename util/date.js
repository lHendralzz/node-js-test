exports.isValidDate = date => {
    let dateObj = new Date(date);

    return isNaN(dateObj);
};
