import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { campaignState } from '../../state/campaign';
import Input from '../input';

interface IFormInput {
  title: string;
  players: string[];
}

export default function CampaignForm(): JSX.Element {
  const { register, handleSubmit } = useForm<IFormInput>();
  const [campaign, setCampaign] = useRecoilState(campaignState);
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const onSubmit = (data: IFormInput) => {
    const { title, ...players } = data;
    const playerData = Object.values(players);
    fetch('/players', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(playerData)

     });
    setCampaign({
      title,
      players: playerData
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