import { useState } from 'react';
import { localDateString, TIME_SLOTS, validateBooking } from './booking.js';

const initialValues = {
  name: '', email: '', date: '', time: '', guests: '2', occasion: 'Just because', seating: 'No preference',
};

function LemonMark() {
  return (
    <svg className="lemon-mark" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M19.8 8.1c5.2-5.1 10.4-4.4 13.4-3.2-1.4 5-5.9 8.6-11.6 8.3" fill="currentColor" />
      <path d="M20 11.2c-6-4.9-12-2.1-14.1-.5 2 4.9 6.7 7.1 12.4 5.9" fill="#6b8f54" />
      <path d="M20 11c-6.2 0-12.3 5.9-12.3 13a12.3 12.3 0 0 0 24.6 0c0-7.1-6.1-13-12.3-13Z" fill="#f5ce46" />
      <path d="M20 14v19" stroke="#fff6cf" strokeWidth="1.5" opacity=".8" />
    </svg>
  );
}

function Sunburst({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5v4m0 13v4m10.5-10.5h-4m-13 0h-4m18.9-7.4-2.8 2.8M6.4 17.6l-2.8 2.8m16.8 0-2.8-2.8M6.4 6.4 3.6 3.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.3" fill="currentColor" />
    </svg>
  );
}

function Field({ id, label, error, hint, children }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' field-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children({ 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && <span className="field-hint" id={`${id}-hint`}>{hint}</span>}
      {error && <span className="field-error-text" id={`${id}-error`} role="alert">{error}</span>}
    </div>
  );
}

function App() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const today = localDateString();

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    setAttempted(false);
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);
    const nextErrors = validateBooking(values, today);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setAttempted(false);
    } else {
      setSubmitted(false);
      const firstInvalidId = {
        name: 'guest-name',
        email: 'guest-email',
        date: 'booking-date',
        time: 'booking-time',
        guests: 'guest-count',
      }[Object.keys(nextErrors)[0]];
      document.getElementById(firstInvalidId)?.focus();
    }
  }

  function startAnotherBooking() {
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
    setAttempted(false);
    document.getElementById('guest-name')?.focus();
  }

  const dateLabel = values.date
    ? new Date(`${values.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'your chosen day';

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Little Lemon home">
          <LemonMark />
          <span className="brand-name">little lemon<span> MEDITERRANEAN KITCHEN</span></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#menu">Menu</a>
          <a href="#story">Our story</a>
          <a className="nav-book" href="#booking" aria-current="page">Book a table <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main id="home">
        <section className="intro" aria-labelledby="page-title">
          <div className="intro-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> A little table, a lot to enjoy</p>
            <h1 id="page-title">Good food.<br /><em>Better together.</em></h1>
            <p className="intro-description">Save your seat for bright Mediterranean flavors, easy afternoons, and evenings that linger.</p>
          </div>
          <div className="hours-note"><span className="hours-sun"><Sunburst /></span><span>Open for dinner<br /><strong>Tuesday – Sunday · 5–10 pm</strong></span></div>
        </section>

        <section className="booking-layout" id="booking" aria-labelledby="booking-title">
          <div className="booking-panel">
            {!submitted ? (
              <>
                <div className="panel-heading">
                  <div>
                    <p className="panel-kicker">A seat at our table</p>
                    <h2 id="booking-title">Find your table</h2>
                  </div>
                  <span className="step-mark"><Sunburst /></span>
                </div>
                <p className="panel-subtitle">Choose a date and time to get started. We can’t wait to have you.</p>

                {attempted && Object.keys(errors).length > 0 && (
                  <div className="error-summary" role="alert" aria-live="assertive">
                    <strong>A couple of details need your attention.</strong>
                    <span>Check the fields marked below, then try again.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-grid form-grid-primary">
                    <Field id="booking-date" label="Date" error={errors.date}>
                      {(props) => <input {...props} id="booking-date" name="date" type="date" min={today} value={values.date} onChange={(event) => update('date', event.target.value)} />}
                    </Field>
                    <Field id="booking-time" label="Time" error={errors.time}>
                      {(props) => (
                        <select {...props} id="booking-time" name="time" value={values.time} onChange={(event) => update('time', event.target.value)}>
                          <option value="">Choose a time</option>
                          {TIME_SLOTS.map((time) => <option key={time} value={time}>{time}</option>)}
                        </select>
                      )}
                    </Field>
                  </div>

                  <div className="form-grid form-grid-secondary">
                    <Field id="guest-count" label="Party size" error={errors.guests}>
                      {(props) => (
                        <select {...props} id="guest-count" name="guests" value={values.guests} onChange={(event) => update('guests', event.target.value)}>
                          {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} {count === 1 ? 'guest' : 'guests'}</option>)}
                        </select>
                      )}
                    </Field>
                    <Field id="occasion" label="Occasion" hint="Optional">
                      {(props) => (
                        <select {...props} id="occasion" name="occasion" value={values.occasion} onChange={(event) => update('occasion', event.target.value)}>
                          {['Just because', 'Birthday', 'Anniversary', 'Date night', 'Family gathering'].map((occasion) => <option key={occasion}>{occasion}</option>)}
                        </select>
                      )}
                    </Field>
                  </div>

                  <fieldset className="seating-fieldset">
                    <legend>Where would you like to sit? <span>Optional</span></legend>
                    <div className="choice-row">
                      {['No preference', 'Inside', 'Patio'].map((choice) => (
                        <label className={`choice-chip${values.seating === choice ? ' selected' : ''}`} key={choice}>
                          <input type="radio" name="seating" value={choice} checked={values.seating === choice} onChange={(event) => update('seating', event.target.value)} />
                          <span className="radio-mark" aria-hidden="true" />{choice}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="form-grid form-grid-contact">
                    <Field id="guest-name" label="Your name" error={errors.name}>
                      {(props) => <input {...props} id="guest-name" name="name" autoComplete="name" placeholder="First and last name" value={values.name} onChange={(event) => update('name', event.target.value)} />}
                    </Field>
                    <Field id="guest-email" label="Email address" error={errors.email}>
                      {(props) => <input {...props} id="guest-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={(event) => update('email', event.target.value)} />}
                    </Field>
                  </div>

                  <button className="submit-button" type="submit">Find a table <span aria-hidden="true">↗</span></button>
                  <p className="form-footnote">Your booking request is a demo and won’t be sent to the restaurant.</p>
                </form>
              </>
            ) : (
              <div className="confirmation" role="status" aria-live="polite">
                <span className="confirmation-icon" aria-hidden="true">✓</span>
                <p className="panel-kicker">A place is set</p>
                <h2 id="booking-title">Thanks, {values.name.split(' ')[0]}.</h2>
                <p className="confirmation-copy">Your demo booking request is ready for <strong>{values.guests} {values.guests === '1' ? 'guest' : 'guests'}</strong> on <strong>{dateLabel}</strong> at <strong>{values.time}</strong>.</p>
                <p className="confirmation-email">A real reservation hasn’t been made. This project’s form doesn’t connect to a restaurant booking system.</p>
                <button className="submit-button" type="button" onClick={startAnotherBooking}>Make another booking <span aria-hidden="true">↗</span></button>
              </div>
            )}
          </div>

          <aside className="side-story" aria-label="A taste of Little Lemon">
            <div className="food-photo" role="img" aria-label="Meze platter with grilled vegetables, feta, flatbread and three dips" />
            <div className="photo-caption"><span>Fresh from our kitchen</span><Sunburst className="caption-spark" /></div>
            <blockquote>“A little sunshine<br />in every <em>bite.</em>”</blockquote>
            <p className="story-credit">Seasonal ingredients. Always made with love.</p>
          </aside>
        </section>
      </main>

      <footer className="site-footer" id="story">
        <span>Little Lemon <span className="footer-dot">·</span> Chicago, IL</span>
        <span>Good food tastes better together.</span>
        <a id="menu" href="#booking">Back to the table ↑</a>
      </footer>
    </div>
  );
}

export default App;
