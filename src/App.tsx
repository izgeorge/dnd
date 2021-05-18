import React, { useEffect } from 'react';
import './App.css';
import CampaignForm from './components/campaign-form';
import io from 'socket.io-client';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { campaignState, playersFamily, socketState } from './state/campaign';
import Character, { IPlayer } from './components/character';

function App(): JSX.Element {
  const [campaign, setCampaign] = useRecoilState(campaignState);
  const [socketObj, setSocket] = useRecoilState(socketState);
  const setPlayer = useRecoilCallback(({ set }) => (playerId: string, newValue: IPlayer) => {
    set(playersFamily(playerId), newValue);
  }, []);

  useEffect(() => {
    if (!socketObj.socket) {
      setSocket({
        socket: io('http://localhost:5000/')
      });
    }
  }, [socketObj.socket]);

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
      {campaign.playerIds.map(playerId => <Character key={playerId} playerId={playerId} />)}
    </div>
  );
}

export default App;
