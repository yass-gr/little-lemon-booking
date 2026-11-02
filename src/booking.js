export const TIME_SLOTS = [
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM',
];

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateBooking(values, today = localDateString()) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter an email in the format name@example.com.';
  if (!values.date) errors.date = 'Choose a date for your visit.';
  else if (values.date < today) errors.date = 'Choose today or a future date.';
  if (!TIME_SLOTS.includes(values.time)) errors.time = 'Choose one of the available seating times.';
  const guests = Number(values.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 10) errors.guests = 'Choose a party size from 1 to 10.';
  return errors;
}
