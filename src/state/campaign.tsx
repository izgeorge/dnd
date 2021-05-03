import { atom } from 'recoil';

export const campaignState = atom({
  key: 'campaignState',
  default: {
    title: '',
    players: [''],
  },
});
