import React, { useEffect } from 'react';
import './App.css';
import CampaignForm from './components/campaign-form';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { campaignState, playersFamily } from './state/campaign';
import Character, { IPlayer } from './components/character';

function App(): JSX.Element | null {
  const [campaign, setCampaign] = useRecoilState(campaignState);
  const setPlayer = useRecoilCallback(({ set }) => (playerId: string, newValue: IPlayer) => {
    set(playersFamily(playerId), newValue);
  }, []);


  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await fetch('http://localhost:5000/campaign');
      const body = await response.json();
      const playerIds: string[] = [];
      body.players.forEach((player: IPlayer) => {
        playerIds.push(player.id);
        setPlayer(player.id, player);
      });
      setCampaign({ title: body.title, playerIds });
    };

    if (!campaign.title) {
      fetchCampaign();
    }
  }, []);

  return (
    <div className="h-screen">
      {!campaign.title && <CampaignForm />}
      {!!campaign.playerIds.length && campaign.playerIds.map(playerId => <Character key={playerId} playerId={playerId} />)}
    </div>
  );
}

export default App;
