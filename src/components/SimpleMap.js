import React, { useEffect } from 'react';
import mmrgl from 'mmr-gl';
import 'mmr-gl/dist/mmr-gl.css';

export function SimpleMap() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      mmrgl.accessToken = process.env.GATSBY_MMR_TOKEN;

      const map = new mmrgl.Map({
        container: 'map',
        zoom: 8,
        center: [37.6165, 55.7505],
        style: 'mmr://api/styles/main_style.json',
        hash: true,
      });

      return () => {
        if (map) map.remove();
      };
    }
  }, []);

  return <div id="map" style={{ width: '100%', height: '600px' }} />;
}