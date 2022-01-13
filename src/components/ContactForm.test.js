import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
  render(<ContactForm />);
});

test('renders the contact form header', ()=> {
  render(<ContactForm />);

  const header = screen.queryByText(/contact form/i);

  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />);

  const input = "Four";
  const firstName = screen.getByLabelText(/first name*/i);
  userEvent.type(firstName, input);

  await waitFor(async () => {
    const error = screen.queryAllByTestId("error");
    expect(error).toHaveLength(1);
  });
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />);

  const submit = screen.getByRole("button");
  userEvent.click(submit);

  await waitFor(async () => {
    const error = screen.queryAllByTestId("error");
    expect(error).toHaveLength(3);
  });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />);

  const input = "Valid";
  const firstName = screen.getByLabelText(/first name*/i);
  userEvent.type(firstName, input);
  const lastName = screen.getByLabelText(/last name*/i);
  userEvent.type(lastName, input);
  const submit = screen.getByRole("button");
  userEvent.click(submit);

  await waitFor(async () => {
    const error = screen.queryAllByTestId("error");
    expect(error).toHaveLength(1);
  });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);

  const input = "invalidemail@nowhere";
  const email = screen.getByLabelText(/email*/i);
  userEvent.type(email, input);

  await waitFor(async () => {
    const error = screen.queryByTestId("error");
    expect(error).toHaveTextContent("email must be a valid email address");
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const validFirst = "Valid";
  const validEmail = "validemail@nowhere.com";
  const firstName = screen.getByLabelText(/first name*/i);
  userEvent.type(firstName, validFirst);
  const email = screen.getByLabelText(/email*/i);
  userEvent.type(email, validEmail);
  const submit = screen.getByRole("button");
  userEvent.click(submit);

  await waitFor(async () => {
    const error = screen.queryByTestId("error");
    expect(error).toHaveTextContent("lastName is a required field");
  });
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />);

  const validName = "Valid";
  const validEmail = "validemail@nowhere.com";
  const firstName = screen.getByLabelText(/first name*/i);
  userEvent.type(firstName, validName);
  const lastName = screen.getByLabelText(/last name*/i);
  userEvent.type(lastName, validName);
  const email = screen.getByLabelText(/email*/i);
  userEvent.type(email, validEmail);
  const submit = screen.getByRole("button");
  userEvent.click(submit);

  await waitFor(async () => {
    const display = screen.queryByText(/you submitted:/i);
    expect(display).toBeTruthy();
    const displayFirst = screen.queryByTestId(/firstnamedisplay/i);
    expect(displayFirst).toBeTruthy();
    const displayLast = screen.queryByTestId(/lastnamedisplay/i);
    expect(displayLast).toBeTruthy();
    const displayEmail = screen.queryByTestId(/emaildisplay/i);
    expect(displayEmail).toBeTruthy();
    const displayMessage = screen.queryByTestId(/messagedisplay/i);
    expect(displayMessage).not.toBeTruthy();
  });
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm />);

  const validName = "Valid";
  const validEmail = "validemail@nowhere.com";
  const note = "Now here's a little story all about how...";
  const firstName = screen.getByLabelText(/first name*/i);
  userEvent.type(firstName, validName);
  const lastName = screen.getByLabelText(/last name*/i);
  userEvent.type(lastName, validName);
  const email = screen.getByLabelText(/email*/i);
  userEvent.type(email, validEmail);
  const message = screen.getByLabelText(/message/i);
  userEvent.type(message, note);
  const submit = screen.getByRole("button");
  userEvent.click(submit);

  await waitFor(async () => {
    const display = screen.queryByText(/you submitted:/i);
    expect(display).toBeTruthy();
    const displayFirst = screen.queryByTestId(/firstnamedisplay/i);
    expect(displayFirst).toBeTruthy();
    const displayLast = screen.queryByTestId(/lastnamedisplay/i);
    expect(displayLast).toBeTruthy();
    const displayEmail = screen.queryByTestId(/emaildisplay/i);
    expect(displayEmail).toBeTruthy();
    const displayMessage = screen.queryByTestId(/messagedisplay/i);
    expect(displayMessage).toBeTruthy();
  });
});