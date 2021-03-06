import { v3, checksumAddress } from 'fixtures/accounts';
import mutations from '@/store/accounts/mutations';
import {
  CHANGE_INIT_STATUS,
  SET_ADDRESS,
  ADD_WALLET,
  SET_HD_KEY,
  SET_BALANCE,
  SET_HARDWARE_XPUB,
} from '@/store/accounts/mutations-types';

describe('Accounts mutations', () => {
  describe(CHANGE_INIT_STATUS, () => {
    it('should change init status', () => {
      const state = { isInited: false };

      mutations[CHANGE_INIT_STATUS](state, true);

      expect(state.isInited).toBe(true);
    });
  });

  describe(SET_ADDRESS, () => {
    it('should set address', () => {
      const state = { address: null };

      mutations[SET_ADDRESS](state, checksumAddress);

      expect(state.address).toBe(checksumAddress);
    });
  });

  describe(ADD_WALLET, () => {
    it('should add wallet', () => {
      const state = { wallets: {} };

      mutations[ADD_WALLET](state, v3);

      expect(state.wallets).toEqual({
        [v3.address]: v3,
      });
    });
  });

  describe(SET_HD_KEY, () => {
    it('should set hd key', () => {
      const state = { hdKey: null };

      mutations[SET_HD_KEY](state, v3);

      expect(state.hdKey).toEqual(v3);
    });
  });

  describe(SET_BALANCE, () => {
    it('should set balance', () => {
      const state = { balance: null };
      const balance = '100';

      mutations[SET_BALANCE](state, balance);

      expect(state.balance).toBe(balance);
    });
  });

  describe(SET_HARDWARE_XPUB, () => {
    it('should set hardware wallet xpub', () => {
      const state = { hardwareXpub: {} };

      mutations[SET_HARDWARE_XPUB](state, {
        walletType: 'foo',
        xpub: 'bar',
      });

      expect(state.hardwareXpub).toEqual({
        foo: 'bar',
      });
    });
  });
});
