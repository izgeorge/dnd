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
    setCampaign({
      title,
      players: Object.values(players)
    });

    fetch('/players', { method: 'POST', body: JSON.stringify(players) });
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