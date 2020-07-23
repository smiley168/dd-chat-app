import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders DD Chat App header', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/DD Chat App/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders currently signed in user info', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Signed In As:/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders the send button for the input box', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Send/i);
  expect(linkElement).toBeInTheDocument();
});
