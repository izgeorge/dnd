import React from 'react';
import './App.css';
import CampaignForm from './components/campaign-form';
import Encounter from './components/encounter';

function App(): JSX.Element {
  return (
    <div className="h-screen">
      <CampaignForm />
      <Encounter />
    </div>
  );
}

export default App;
