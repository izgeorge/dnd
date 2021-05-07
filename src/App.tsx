import React, { useEffect, useState } from 'react';
import './App.css';
import CampaignForm from './components/campaign-form';
import Encounter from './components/encounter';

function App(): JSX.Element {
  const [state, setState] = useState<{data: any}>();
  const callBackendAPI = async () => {
    const response = await fetch('/players');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message); 
    }
    return body;
  };

  useEffect(() => {
    callBackendAPI()
    .then(res => setState({ data: res.express }))
    .catch(err => console.log(err));
  }, []);

  return (
    <div className="h-screen">
      <CampaignForm />
      <Encounter />
    </div>
  );
}

export default App;
