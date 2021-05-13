import React from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import { useRecoilValue } from 'recoil';
import { campaignState } from '../../state/campaign';

export default function Encounter(): JSX.Element {
  const campaign = useRecoilValue(campaignState);

  const onDragStop = (data: DraggableEvent, playerId: string) => {
    if (!(data instanceof MouseEvent)) {
      return;
    }

    fetch('http://localhost:5000/players/' + playerId, {
      method: 'PUT',
      body: JSON.stringify({
        x: data.screenX,
        y: data.screenY
      }),
      headers: {
        mode: 'cors',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  };
  return (
    <>
      {campaign.players.map((player) => {
        console.log(player.pos);
        return (
          <Draggable onStop={(e: DraggableEvent) => onDragStop(e, player.id)} key={player.id}>
            <div className="w-max flex flex-col items-center">
              <div className="h-6 w-6 bg-black" />{player.name}
            </div>
          </Draggable>
        );
      })}
    </>
  );
}