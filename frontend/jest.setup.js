import '@testing-library/jest-dom/extend-expect';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {},
  serverRuntimeConfig: {},
}));
