import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import io from 'socket.io-client';
import { socketState } from '../../state/campaign';

function SocketWrapper({ children }: { children: JSX.Element }): JSX.Element {
  const [socket, setSocket] = useRecoilState(socketState);
  useEffect(() => {
    if (!socket) {
      setSocket(io('http://localhost:5000/'));
    }
  }, [socket]);

  return (
    <>
      {children}
    </>
  );
}

export default SocketWrapper;
