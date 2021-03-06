import { shallow, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VeeValidate from 'vee-validate';
import VueRouter from 'vue-router';

import { address } from '../../../fixtures/accounts';

import ImportFromPublicKey from '@/components/importWallet/ImportFromPublicKey';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VeeValidate);
localVue.use(VueRouter);

describe('ImportFromPublicKey', () => {
  let wrapper, actions, router;
  beforeEach(() => {
    actions = {
      addWalletWithPublicKey: jest.fn(),
    };
    const storeOptions = {
      modules: {
        accounts: {
          namespaced: true,
          actions,
        },
      },
    };
    router = new VueRouter();
    const store = new Vuex.Store(storeOptions);
    wrapper = shallow(ImportFromPublicKey, {
      localVue,
      store,
      router,
    });
  });
  describe('render', () => {
    it('should be a Vue component', () => {
      expect(wrapper.name()).toBe('ImportFromPublicKey');
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('should render initial state of the component', () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  describe('methods', () => {
    describe('addWallet', () => {
      it('should call vuex addWalletWithPublicKey with correct arguments', () => {
        wrapper.setData({ address });
        wrapper.vm.submitAddWallet();
        expect(actions.addWalletWithPublicKey).toBeCalledWith(
          expect.any(Object),
          address,
          undefined,
        );
      });

      it('should redirect to root after successful wallet creation', async () => {
        expect.assertions(2);
        router.push('/kek');
        expect(router.currentRoute.fullPath).toBe('/kek');
        await wrapper.vm.submitAddWallet();
        expect(router.currentRoute.fullPath).toBe('/');
      });

      it('should add error to field if failed to create wallet', () => {
        actions.addWalletWithPublicKey.mockImplementationOnce(() => {
          throw new Error();
        });
        wrapper.vm.submitAddWallet();
        expect(wrapper.vm.errors.items[0]).toEqual({
          field: 'address',
          id: 'wrongAddress',
          msg: 'Address is invalid',
          // vee validate added field
          scope: null,
        });
      });
    });

    describe('handleInput', () => {
      it('should clear error with wrongAddress id', () => {
        wrapper.vm.errors.add({
          field: 'address',
          msg: 'Address is invalid',
          id: 'wrongAddress',
        });
        expect(wrapper.vm.errors.has('address')).toBe(true);
        wrapper.vm.handleInput();
        expect(wrapper.vm.errors.has('address')).toBe(false);
      });
    });
  });
});
