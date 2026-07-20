

export const useGodot = () => {
  const ASSETS_BASE = 'https://assets.portfolio.giuliotognetto.dev';

  const loadGodot = async (canvas: HTMLCanvasElement, onProgress: (c: number, t: number) => void) => {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${ASSETS_BASE}/index.js`; // Il file JS generato da Godot
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    // 2. Ora che il tag script è stato caricato, 'Engine' è disponibile globalmente
    // @ts-ignore
    const { Engine } = window;

    // @ts-ignore
    await Engine.load(`${ASSETS_BASE}/index`);

    // 2. Crea l'istanza con la configurazione corretta
    // @ts-ignore
    const engine = new Engine({
      executable: `${ASSETS_BASE}/index`, // Nome del file .wasm senza estensione
      mainPack: `${ASSETS_BASE}/index.pck`,
      canvas: canvas,
      onProgress: onProgress,
    });

    // 3. Avvia il gioco
    await engine.startGame();
    return engine;
  };

  return { loadGodot, ASSETS_BASE };
};