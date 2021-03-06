import React from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { playersFamily, socketState } from '../../state/campaign';

export interface IPlayer {
  id: string;
  name: string;
  pos: {
    x: number;
    y: number;
  }
}

export default function Character({ playerId }: { playerId: string }): JSX.Element | null {
  const player = useRecoilValue(playersFamily(playerId)) as IPlayer;
  console.log(player);
  if (!player) {
    return null;
  }

  const onUpdatePlayer = useRecoilCallback(({ set }) => (data: IPlayer) => {
    if (data.id !== playerId) {
      return;
    }
    set(playersFamily(playerId), data);
  });

  const socket = useRecoilValue(socketState);
  const onDragStop = (data: DraggableEvent, playerId: string) => {
    if (!(data instanceof MouseEvent) || !socket) {
      return;
    }

    socket?.emit('update player', {
      id: playerId,
      pos: {
        x: data.pageX,
        y: data.pageY
      }
    });
  };

  socket?.on('update player', async (data) => {
    onUpdatePlayer(data);
  });

  return (
    <Draggable defaultClassName="absolute" position={{ x: player.pos.x, y: player.pos.y }} onStop={(e: DraggableEvent) => onDragStop(e, player.id)} key={player.id}>
      <div className="w-max flex flex-col items-center">
        <div className="h-6 w-6 bg-black" />{player.name}
      </div>
    </Draggable>
  );
}
