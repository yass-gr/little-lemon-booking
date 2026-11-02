import { describe, expect, it } from 'vitest';
import { validateBooking } from './booking.js';

const validBooking = {
  name: 'Mina Haddad',
  email: 'mina@example.com',
  date: '2026-11-20',
  time: '7:00 PM',
  guests: '2',
};

describe('validateBooking', () => {
  it('accepts a complete booking with a valid email and future date', () => {
    expect(validateBooking(validBooking, '2026-11-02')).toEqual({});
  });

  it('requires name, email, date, and an available time', () => {
    expect(validateBooking({ ...validBooking, name: ' ', email: '', date: '', time: '' }, '2026-11-02')).toMatchObject({
      name: 'Please enter your name.',
      email: 'Please enter your email address.',
      date: 'Choose a date for your visit.',
      time: 'Choose one of the available seating times.',
    });
  });

  it('rejects a malformed email, a past date, and a party larger than ten', () => {
    expect(validateBooking({ ...validBooking, email: 'mina@', date: '2026-11-01', guests: '11' }, '2026-11-02')).toMatchObject({
      email: 'Enter an email in the format name@example.com.',
      date: 'Choose today or a future date.',
      guests: 'Choose a party size from 1 to 10.',
    });
  });
});
