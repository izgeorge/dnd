import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { Socket } from 'socket.io-client';
import { IPlayer } from '../components/character';

export const socketState = atom<{
  socket: Socket | null
}>({
  key: 'socketState',
  default: {
    socket: null,
  },
  dangerouslyAllowMutability: true,
});

export const campaignState = atom<{
  title: string;
  playerIds: string[];
}>({
  key: 'campaignState',
  default: {
    title: '',
    playerIds: [],
  },
});

export const playersFamily = atomFamily({
  key: 'playersFamily',
  default: selectorFamily({
    key: 'playersFamilyDefault',
    get: () => () => ({}),
    set: id => ({ set }, newValue) => {
      set(playersFamily(id), newValue);
    }
  }),
});

// export const playersFamily = atomFamily({
//   key: 'playersFamily',
//   default: {},
// });

export const playersState = selector<string[]>({
  key: 'playerState',
  get: ({ get }) => {
    const campaign = get(campaignState);
    return campaign.playerIds;
  },
  set: ({ get, set }, newState) => {
    const campaign = get(campaignState);
    set(campaignState, {
      ...campaign, playerIds: newState as string[]
    });
  }
});