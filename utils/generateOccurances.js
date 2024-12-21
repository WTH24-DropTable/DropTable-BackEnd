export default function generateOccurrences(startTimestamp, occurrenceType, repeatCount) {
    const occurrences = [];
    const incrementMap = {
        daily: 24 * 60 * 60 * 1000,
        weekly: 7 * 24 * 60 * 60 * 1000,
        biweekly: 14 * 24 * 60 * 60 * 1000,
        monthly: (date) => {
            // Handle monthly by adding months
            const newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate.getTime() - date.getTime();
        },
        yearly: (date) => {
            // Handle yearly by adding years
            const newDate = new Date(date);
            newDate.setFullYear(newDate.getFullYear() + 1);
            return newDate.getTime() - date.getTime();
        }
    };

    let currentTimestamp = startTimestamp;
    occurrences.push(currentTimestamp); // First occurrence

    for (let i = 1; i < repeatCount; i++) {
        if (occurrenceType === 'monthly' || occurrenceType === 'yearly') {
            // Calculate increments for monthly or yearly
            currentTimestamp += incrementMap[occurrenceType](currentTimestamp);
        } else if (incrementMap[occurrenceType] !== undefined) {
            // Add fixed increments for other types
            currentTimestamp += incrementMap[occurrenceType];
        } else {
            throw new Error(`Unknown occurrence type: ${occurrenceType}`);
        }
        occurrences.push(currentTimestamp);
    }

    return occurrences;
}