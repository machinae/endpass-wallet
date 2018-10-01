// List of ERC20 tokens with information
export const tokens = [
  {
    name: 'First Token',
    symbol: 'FST',
    address: '0x4Ce2109f8DB1190cd44BC6554E35642214FbE144',
    decimals: 18,
    logo: '/img/FST.png',
  },
  {
    name: 'second token',
    symbol: 'SCDT',
    address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    decimals: 8,
    logo: '',
  },
];

export const token = {
  name: 'Single token',
  symbol: 'SNGLTK',
  address: '0xE41d2489571d322189246DaFA5ebDe1F46990000',
  decimals: 8,
  logo: '',
};

export const tokensPrices = {
  '0x4Ce2109f8DB1190cd44BC6554E35642214FbE144': '1',
  '0xE41d2489571d322189246DaFA5ebDe1F4699F498': '2',
  '0xE41d2489571d322189246DaFA5ebDe1F46990000': '0',
};

export const balances = {
  '0x0': '1',
  '0x1': '2',
};

export const tokensByNetworks = {
  1: {
    '0x4Ce2109f8DB1190cd44BC6554E35642214FbE144': {
      name: 'First Token',
      symbol: 'FST',
      address: '0x4Ce2109f8DB1190cd44BC6554E35642214FbE144',
      decimals: 18,
      logo: '/img/FST.png',
    },
  },
  2: {
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498': {
      name: 'second token',
      symbol: 'SCDT',
      address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
      decimals: 8,
      logo: '',
    },
  },
};

export const tokensMappedByAddresses = {
  '0x4Ce2109f8DB1190cd44BC6554E35642214FbE144': {
    name: 'First Token',
    symbol: 'FST',
    address: '0x4Ce2109f8DB1190cd44BC6554E35642214FbE144',
    decimals: 18,
    logo: '/img/FST.png',
  },
  '0xE41d2489571d322189246DaFA5ebDe1F4699F498': {
    name: 'second token',
    symbol: 'SCDT',
    address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    decimals: 8,
    logo: '',
  },
};

export const tokensByUserAddresses = {
  '0x0': Object.keys(tokensMappedByAddresses),
};

// Tokens keyed by address, like in store.tokens.allTokens
export const allTokens = tokens.reduce(
  (acc, item) =>
    Object.assign(acc, {
      [item.address]: item,
    }),
  {},
);

export default {
  tokens,
  token,
  tokensPrices,
  tokensByNetworks,
  tokensMappedByAddresses,
  tokensByUserAddresses,
  balances,
  allTokens,
};
