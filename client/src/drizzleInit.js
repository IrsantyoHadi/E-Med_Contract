import { Drizzle } from '@drizzle/store';
import IRSToken from './contracts/IRSTKN.json';
import Emed from './contracts/Emed.json';

const options = {
  contracts: [IRSToken, Emed],
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:7545',
    },
  },
};

const drizzle = new Drizzle(options);

export default drizzle;
