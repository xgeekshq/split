import '@testing-library/jest-dom';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {},
  serverRuntimeConfig: {},
}));
