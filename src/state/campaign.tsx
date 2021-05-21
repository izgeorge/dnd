import { atom, atomFamily, selector } from 'recoil';
import { Socket } from 'socket.io-client';

export const socketState = atom<Socket | null>({
  key: 'socketState',
  default: null,
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
  default: {},
});

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