import React from 'react';
import Draggable from 'react-draggable';
import { useRecoilValue } from 'recoil';
import { campaignState } from '../../state/campaign';

export default function Encounter(): JSX.Element {
  const campaign = useRecoilValue(campaignState);
  return (
    <>
      {campaign.players.map((player) => {
        return (
          <Draggable key={player}>
            <div className="w-max flex flex-col items-center">
              <div className="h-6 w-6 bg-black" />{player}
            </div>
          </Draggable>
        );
      })}
    </>
  );
}