import { shallow, createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Notifications from 'vue-notification';
import validation from '@/validation';

import TokensPage from '@/components/pages/Tokens.vue';
import { generateStubs } from '@/utils/testUtils';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Notifications);

describe('TokensPage', () => {
  let wrapper;
  let actions;
  let store;
  let options;
  let tokens;

  beforeEach(() => {
    tokens = [
      {
        name: 'First Token',
        symbol: 'FST',
        address: '0xFST',
      },
      {
        name: 'second token',
        symbol: '$SCdT',
        address: '0x$SCdT',
      },
    ];

    actions = {
      updateTokenPrice: jest.fn(),
      addTokenToSubscription: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        accounts: {
          namespaced: true,
          state: {
            settings: {
              fiatCurrency: 'USD',
            },
          },
        },
        tokens: {
          namespaced: true,
          state: {
            activeTokens: tokens,
            prices: null,
          },
        },
        price: {
          namespaced: true,
          state: {
            price: null,
          },
        },
      },
    });

    options = {
      store,
      localVue,
      methods: {
        getAllTokens: () => {},
      },
    };
  });

  afterEach(() => {
    actions.updateTokenPrice.mockClear();
    actions.addTokenToSubscription.mockClear();
  });

  describe('render', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(TokensPage, {
        ...options,
        stubs: generateStubs(TokensPage),
        // methods: {
        //   getAllTokens: () => { console.log(1) }
        // },
      });
    });

    it('should be a Vue component', () => {
      expect(wrapper.name()).toBe('tokens-page');
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('should render component', () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  describe('behavior', () => {
    beforeEach(() => {
      wrapper = shallow(TokensPage, options);
    });

    describe('search', () => {
      it("should correctly find the user's tokens", () => {
        expect(wrapper.vm.userTokenList).toHaveLength(2);

        wrapper.setData({
          search: 'fst',
        });

        expect(wrapper.vm.userTokenList).toHaveLength(1);
      });

      it('should correctly find tokens in list', async () => {
        expect(wrapper.vm.searchTokenList).toHaveLength(0);

        wrapper.setData({
          tokens: [
            ...tokens,
            {
              name: 'Third Token',
              symbol: 'TTKN',
              address: '0xTTKN',
            },
            {
              name: 'fours token',
              symbol: 'FurT',
              address: '0xFurT',
            },
          ],
        });

        expect(wrapper.vm.$data.tokens).toHaveLength(4);

        wrapper.setData({
          searchToken: 'ttk',
        });

        expect(wrapper.vm.searchTokenList).toHaveLength(1);

        wrapper.setData({
          searchToken: '',
        });

        expect(wrapper.vm.searchTokenList).toHaveLength(2);

        wrapper.setData({
          searchToken: 'hir',
        });

        expect(wrapper.vm.searchTokenList).toHaveLength(1);
      });
    });
  });
});