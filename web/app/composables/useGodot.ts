
export const useGodot = () => {
  const loadGodot = async (config: any) => {
    return new Promise((resolve, reject) => {
      // Carica l'engine globalmente
      const script = document.createElement('script');
      script.src = '/godot/index.js';
      script.async = true;

      script.onload = () => {
        // @ts-ignore
        const engine = new window.Engine(config);
        script.remove(); // Rimuoviamo il tag script dal DOM
        resolve(engine);
      };

      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return { loadGodot };
};