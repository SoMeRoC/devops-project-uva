import { useEffect, useRef } from 'react';
import { Chessground as ChessgroundApi } from 'chessground';

import { Api as cgApi } from 'chessground/api';
import { Config } from 'chessground/config';

interface Props {
  width?: number
  height?: number
  contained?: boolean
  config?: Config
  api?: cgApi | null
  setApi?: (api: cgApi) => void;
}
async function callAzureFunction(): Promise<void> {
  const functionUrl = "https://func-someroc-usermanagement-dev.azurewebsites.net/api/validate";
  const requestBody = {
    key1: "value1"
  };

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-functions-key": (process.env.REACT_APP_USER_API as string)
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log(responseData);
      } else {
        responseData = await response.text();
        console.log(responseData);
      }
    } else {
      console.error(`Error calling Azure Function: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error calling Azure Function:", error);
  }
}

function Chessground({
  width = 900, height = 900, config = {}, contained = false, api = null, setApi = () => {}
}: Props) {


  const ref = useRef<HTMLDivElement>(null);
  callAzureFunction();

  useEffect(() => {
    if (ref && ref.current && !api) {
      const chessgroundApi = ChessgroundApi(ref.current, {
        animation: { enabled: true, duration: 200 },
        ...config,
      });
      setApi(chessgroundApi);
    } else if (ref && ref.current && api) {
      api.set(config);
    }
  }, [ref, api, config, setApi]);

  useEffect(() => {
    api?.set(config);
  }, [api, config]);

  return (
    <div style={{ height: contained ? '100%' : height, width: contained ? '100%' : width }}>
      <div ref={ref} style={{ height: '100%', width: '100%', display: 'table' }} />
    </div>
  );
}

export default Chessground;