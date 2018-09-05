import Web3 from 'web3';

import actions from '@/store/web3/actions';
import * as mutationsTypes from '@/store/web3/mutations-types';
import { userService } from '@/services';
import { blockUpdateInterval } from '@/config';
import { DEFAULT_NETWORKS, CURRENCIES } from '@/constants';

jest.mock('@/services', () => ({
  userService: {
    setSetting: jest.fn(),
    getSettings: jest.fn().mockResolvedValue({}),
  },
}));

jest.useFakeTimers();

describe('web3 actions', () => {
  const commit = jest.fn();
  const dispatch = jest.fn();

  afterEach(() => {
    userService.setSetting.mockClear();

    clearInterval.mockClear();
    setInterval.mockClear();

    commit.mockClear();
    dispatch.mockClear();
  });

  describe('changeNetwork', () => {
    const { changeNetwork } = actions;
    const networkId = 1;
    const network = { id: networkId };
    const getters = {
      networks: [network],
    };

    it('should call CHANGE_NETWORK mutation', async () => {
      expect.assertions(2);

      await changeNetwork({ commit, dispatch, getters }, { networkId });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(
        mutationsTypes.CHANGE_NETWORK,
        network,
      );
    });

    it('should save network id', async () => {
      expect.assertions(2);

      await changeNetwork({ commit, dispatch, getters }, { networkId });

      expect(userService.setSetting).toHaveBeenCalledTimes(1);
      expect(userService.setSetting).toHaveBeenCalledWith('net', networkId);
    });

    it('should dispatch subscribeOnBlockUpdates and tokens/subscribeOnTokensBalancesUpdates actions', async () => {
      expect.assertions(1);

      await changeNetwork({ commit, dispatch, getters }, { networkId });

      expect(dispatch.mock.calls).toEqual([
        ['subscribeOnBlockUpdates'],
        ['tokens/subscribeOnTokensBalancesUpdates', {}, { root: true }],
      ]);
    });

    it('should handle errors', async () => {
      const error = new Error();

      expect.assertions(4);

      userService.setSetting.mockRejectedValueOnce(error);

      await changeNetwork({ commit, dispatch, getters }, { networkId });

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });

      dispatch.mockClear();
      dispatch.mockRejectedValueOnce(error);

      await changeNetwork({ commit, dispatch, getters }, { networkId });

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });
    });
  });

  describe('changeCurrency', () => {
    const { changeCurrency } = actions;
    const getters = {
      networks: [{ id: 1 }],
    };
    const currencyId = 1;

    it('should call CHANGE_CURRENCY mutation', async () => {
      const state = {
        activeNet: {},
      };
      const currency = CURRENCIES.find(currency => currency.id === currencyId);

      expect.assertions(2);

      await changeCurrency(
        { commit, dispatch, getters, state },
        { currencyId },
      );

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(
        mutationsTypes.CHANGE_CURRENCY,
        currency,
      );
    });

    it('should dispatch changeNetwork action', async () => {
      const state = {
        activeNet: {
          currency: currencyId + 1,
        },
      };

      expect.assertions(2);

      await changeCurrency(
        { commit, dispatch, getters, state },
        { currencyId },
      );

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('changeNetwork', {
        networkId: getters.networks[0].id,
      });
    });

    it('should not dispatch changeNetwork action', async () => {
      const state = {
        activeNet: {
          currency: currencyId,
        },
      };

      expect.assertions(1);

      await changeCurrency(
        { commit, dispatch, getters, state },
        { currencyId },
      );

      expect(dispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('addNetwork', () => {
    const { addNetwork } = actions;
    const getters = {
      networks: [{ id: 1 }],
    };
    const state = {
      storedNetworks: {},
    };

    it('should call ADD_NETWORK mutation', async () => {
      const network = {};

      expect.assertions(2);

      await addNetwork({ commit, dispatch, getters, state }, { network });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(mutationsTypes.ADD_NETWORK, network);
    });

    it('should save networks', async () => {
      const network = {};

      expect.assertions(2);

      await addNetwork({ commit, dispatch, getters, state }, { network });

      expect(userService.setSetting).toHaveBeenCalledTimes(1);
      expect(userService.setSetting).toHaveBeenCalledWith(
        'networks',
        state.storedNetworks,
      );
    });

    it('should dispatch changeNetwork action', async () => {
      const network = { id: 1 };

      expect.assertions(2);

      await addNetwork({ commit, dispatch, getters, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('changeNetwork', {
        networkId: network.id,
      });
    });

    it('should handle the error of adding a new provider', async () => {
      const network = {};
      const error = new Error();

      expect.assertions(4);

      userService.setSetting.mockRejectedValueOnce(error);

      await addNetwork({ commit, dispatch, getters, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });

      dispatch.mockClear();
      dispatch.mockRejectedValueOnce(error);

      await addNetwork({ commit, dispatch, getters, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });
    });
  });

  describe('updateNetwork', () => {
    const { updateNetwork } = actions;
    const state = {
      storedNetworks: {},
    };

    it('should call UPDATE_NETWORK mutation', async () => {
      const network = {};

      expect.assertions(2);

      await updateNetwork({ commit, dispatch, state }, { network });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(
        mutationsTypes.UPDATE_NETWORK,
        network,
      );
    });

    it('should update networks', async () => {
      const network = {};

      expect.assertions(2);

      await updateNetwork({ commit, dispatch, state }, { network });

      expect(userService.setSetting).toHaveBeenCalledTimes(1);
      expect(userService.setSetting).toHaveBeenCalledWith(
        'networks',
        state.storedNetworks,
      );
    });

    it('should handle the network update error', async () => {
      const network = {};
      const error = new Error();

      expect.assertions(2);

      userService.setSetting.mockRejectedValueOnce(error);

      await updateNetwork({ commit, dispatch, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('errors/emitError', error, {
        root: true,
      });
    });
  });

  describe('deleteNetwork', () => {
    const { deleteNetwork } = actions;
    const url = 'url';
    const state = {
      storedNetworks: {},
      activeNet: { url },
    };
    const getters = {
      networks: [{ id: 1 }],
    };

    it('should call DELETE_NETWORK mutation', async () => {
      const network = {};

      expect.assertions(2);

      await deleteNetwork({ commit, dispatch, state, getters }, { network });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(
        mutationsTypes.DELETE_NETWORK,
        network,
      );
    });

    it('should save networks', async () => {
      const network = {};

      expect.assertions(2);

      await deleteNetwork({ commit, dispatch, getters, state }, { network });

      expect(userService.setSetting).toHaveBeenCalledTimes(1);
      expect(userService.setSetting).toHaveBeenCalledWith(
        'networks',
        state.storedNetworks,
      );
    });

    it('should dispatch changeNetwork action', async () => {
      const network = { url };

      expect.assertions(2);

      await deleteNetwork({ commit, dispatch, getters, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('changeNetwork', {
        networkId: getters.networks[0].id,
      });
    });

    it('should not dispatch changeNetwork action', async () => {
      const network = {};

      expect.assertions(1);

      await deleteNetwork({ commit, dispatch, getters, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it('should handle the removal error of the network', async () => {
      const network = { url };
      const error = new Error();

      expect.assertions(4);

      userService.setSetting.mockRejectedValueOnce(error);

      await deleteNetwork({ commit, dispatch, getters, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });

      dispatch.mockClear();
      dispatch.mockRejectedValueOnce(error);

      await deleteNetwork({ commit, dispatch, getters, state }, { network });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });
    });
  });

  describe('validateNetwork', () => {
    const { validateNetwork } = actions;

    it('should return network type and network id', async () => {
      const context = {};
      const network = {
        url: 'https://url',
      };
      let networkType;
      let networkId;
      let result;

      expect.assertions(2);

      networkType = 'ropsten';
      networkId = 3;

      Web3.eth.net.getNetworkType.mockResolvedValueOnce(networkType);
      Web3.eth.net.getId.mockResolvedValueOnce(networkId);

      result = await validateNetwork(context, { network });

      expect(result).toEqual([networkType, networkId]);

      networkType = 'main';
      networkId = 1;

      Web3.eth.net.getNetworkType.mockResolvedValueOnce(networkType);
      Web3.eth.net.getId.mockResolvedValueOnce(networkId);

      result = await validateNetwork(context, { network });

      expect(result).toEqual([networkType, networkId]);
    });
  });

  describe('subscribeOnBlockUpdates', () => {
    const { subscribeOnBlockUpdates } = actions;

    it('should dispatch unsubscribeOnBlockUpdates action', async () => {
      expect.assertions(2);

      await subscribeOnBlockUpdates({ commit, dispatch });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('unsubscribeOnBlockUpdates');
    });

    it('should call setInterval with correct interval', async () => {
      expect.assertions(2);

      await subscribeOnBlockUpdates({ commit, dispatch });

      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenCalledWith(
        expect.any(Function),
        blockUpdateInterval,
      );
    });

    it('should call SET_INTERVAL mutation', async () => {
      const interval = 1;

      expect.assertions(2);
      setInterval.mockReturnValue(interval);

      await subscribeOnBlockUpdates({ commit, dispatch });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(
        mutationsTypes.SET_INTERVAL,
        interval,
      );
    });
  });

  describe('unsubscribeOnBlockUpdates', () => {
    const { unsubscribeOnBlockUpdates } = actions;
    const state = {
      interval: 1,
    };

    it('should clear interval', async () => {
      expect.assertions(2);

      await unsubscribeOnBlockUpdates({ state, commit });

      expect(clearInterval).toHaveBeenCalledTimes(1);
      expect(clearInterval).toHaveBeenCalledWith(state.interval);
    });

    it('should call SET_INTERVAL mutation', async () => {
      expect.assertions(2);

      await unsubscribeOnBlockUpdates({ state, commit });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(mutationsTypes.SET_INTERVAL, null);
    });

    it('should not do anything', async () => {
      const state = {};

      expect.assertions(2);

      await unsubscribeOnBlockUpdates({ state, commit });

      expect(clearInterval).toHaveBeenCalledTimes(0);
      expect(commit).toHaveBeenCalledTimes(0);
    });
  });

  describe('init', () => {
    const { init } = actions;
    const state = {
      activeCurrency: CURRENCIES[0],
    };

    it('should call SET_NETWORKS, CHANGE_NETWORK, CHANGE_CURRENCY mutations', async () => {
      const net = 10;
      const activeNet = {
        id: net,
        name: 'name',
        url: 'url',
        currency: 2,
      };
      const networks = [activeNet];
      const activeCurrency = CURRENCIES.find(
        currency => currency.id === activeNet.currency,
      );

      expect.assertions(1);

      userService.getSettings.mockResolvedValueOnce({ net, networks });

      await init({ commit, dispatch, state });

      expect(commit.mock.calls).toEqual([
        [mutationsTypes.SET_NETWORKS, networks],
        [mutationsTypes.CHANGE_NETWORK, activeNet],
        [mutationsTypes.CHANGE_CURRENCY, activeCurrency],
      ]);
    });

    it('should call SET_NETWORKS, CHANGE_NETWORK, CHANGE_CURRENCY mutations with default settings', async () => {
      const net = 1;
      const networks = [];
      const activeNet = DEFAULT_NETWORKS.find(network => network.id === net);
      const activeCurrency = CURRENCIES.find(
        currency => currency.id === activeNet.currency,
      );

      expect.assertions(1);

      await init({ commit, dispatch, state });

      expect(commit.mock.calls).toEqual([
        [mutationsTypes.SET_NETWORKS, networks],
        [mutationsTypes.CHANGE_NETWORK, activeNet],
        [mutationsTypes.CHANGE_CURRENCY, activeCurrency],
      ]);
    });

    it('should dispatch subscribeOnTokensBalancesUpdates and subscribeOnBlockUpdates actions', async () => {
      expect.assertions(1);

      await init({ commit, dispatch, state });

      expect(dispatch.mock.calls).toEqual([
        ['tokens/subscribeOnTokensBalancesUpdates', {}, { root: true }],
        ['subscribeOnBlockUpdates'],
      ]);
    });

    it('should handle errors', async () => {
      const error = new Error();

      expect.assertions(4);

      userService.getSettings.mockRejectedValueOnce(error);

      await init({ commit, dispatch, state });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });

      dispatch.mockClear();
      dispatch.mockRejectedValueOnce(error);

      await init({ commit, dispatch, state });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith('errors/emitError', error, {
        root: true,
      });
    });
  });
});
