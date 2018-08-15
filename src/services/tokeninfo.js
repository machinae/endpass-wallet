import axios from 'axios';
import { tokenInfoAPIUrl, tokenImageUrl } from '@/config';

export default {
  // Axios instance for this service
  http: axios.create({
    baseURL: tokenInfoAPIUrl,
    timeout: 15000,
  }),

  getTokensList() {
    return this._getTokens().map(this._parseToken);
  },

  // Get list of all tokens with infos
  _getTokens() {
    return this.http.get(`${tokenInfoAPIUrl}/tokens`).then(resp => resp.data);
  },
  // formats a token
  _parseToken(token) {
    return {
      ...token,
      logo: token.logo ? `${tokenImageUrl}${token.logo}` : '',
    };
  },
};
