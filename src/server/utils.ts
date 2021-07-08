// SQLite stores dates without timezone, so we have to tell the `Date` object
// they are in UTC in order to show up correctly on the frontend
export const parseDate = (dateString: string) => new Date(`${dateString} UTC`);

export default parseDate;
