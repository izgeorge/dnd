import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { campaignState, playersFamily } from '../../state/campaign';
import Input from '../input';
import { v4 as uuidv4 } from 'uuid';

interface IPlayer {
  id: string;
  name: string;
  pos: {
    x: number;
    y: number;
  }
}

interface IFormInput {
  title: string;
  players: IPlayer[];
}

export default function CampaignForm(): JSX.Element {
  const campaign = useRecoilValue(campaignState);
  const setCampaign = useSetRecoilState(campaignState);
  const { register, handleSubmit } = useForm<IFormInput>();
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const onUpdatePlayer = useRecoilCallback(({ set }) => (playerId: string, data: IPlayer) => {
    set(playersFamily(playerId), data);
  });
  const onSubmit = (data: IFormInput) => {
    const { title, ...players } = data;
    const playerData = Object.values(players);
    let formattedPlayerData = {};

    playerData.forEach(name => {
      const id = uuidv4();
      const playerObj = {
        id,
        name,
        pos: { x: 0, y: 0 }
      };
      formattedPlayerData = {
        ...formattedPlayerData,
        [id]: {
          id,
          name,
          pos: { x: 0, y: 0 }
        }
      };
      onUpdatePlayer(playerObj.id, playerObj);
    });

    fetch('http://localhost:5000/campaign', {
      method: 'POST',
      body: JSON.stringify({
        title,
        players: formattedPlayerData
      }),
      headers: {
        mode: 'cors',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });

    setCampaign({
      title,
      playerIds: Object.keys(formattedPlayerData)
    });
  };

  const onAddPlayer = () => {
    setNumberOfPlayers(numberOfPlayers+1);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <Input defaultValue={campaign.title} required name="title" label="Campaign Name" register={register} />
      {[...Array(numberOfPlayers)].map((_, idx) => {
        return <Input key={idx} required name={`player-${idx}`} label={`Player ${idx + 1}`} register={register} />;
      })}
      <button className="mb-2" onClick={onAddPlayer}>Add Player</button>
      <button type="submit">Submit</button>
    </form>
  );
}