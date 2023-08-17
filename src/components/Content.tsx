import { Spacer } from "@nextui-org/react";

import { Tournaments } from "./interfaces.js";

import { useEffect, useState } from "react";

interface ContentProps {
  championnat: Tournaments[]
}

export const Content: React.FC<ContentProps> = ({ championnat }) => {
  
 
  return (
    <div style={{ fontSize: "12px", marginTop: "8px" }}>
      <div
       
        // style={{
        //   textGradient: "45deg, $yellow700 -20%, $blue900 50%",
        // }}
        // weight="bold"
      ><div>
      Pitch Poker Tour: 
      {championnat && championnat.length > 0 ? (
        <>
          Saison {championnat[0].id} 
          {championnat[0].year && <div>Année en cours: {championnat[0].year}</div>}
        </>
      ) : (
        <div>Chargement des données...</div>
      )}
    </div>
      </div>
      <Spacer y={1} />
    </div>
  );
};

