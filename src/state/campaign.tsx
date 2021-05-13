import { atom } from 'recoil';

interface IPlayer {
  id: string;
  name: string;
  pos: {
    x: number;
    y: number;
  }
}

export const campaignState = atom<{
  title: string;
  players: IPlayer[];
}>({
  key: 'campaignState',
  default: {
    title: '',
    players: [],
  },
});
