import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

let currentUser = {
  userId: '7272hbw82910',
  userName: 'Feena Fung',
  token: '1271893773-27819329932-82382392039',
  isValid: true
}

test('renders learn react link', () => {
  render(<App currentUser={currentUser} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
