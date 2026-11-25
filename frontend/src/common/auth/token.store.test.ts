import { tokenStore } from './token.store';

describe('tokenStore', () => {
  afterEach(() => tokenStore.clear());

  it('returns the token while valid, nothing close to expiry', () => {
    tokenStore.set('abc', 900);
    expect(tokenStore.get()).toBe('abc');
    tokenStore.set('soon', 10); // within the 30 s skew
    expect(tokenStore.get()).toBeNull();
  });

  it('clear forgets the token', () => {
    tokenStore.set('abc', 900);
    tokenStore.clear();
    expect(tokenStore.get()).toBeNull();
  });
});
