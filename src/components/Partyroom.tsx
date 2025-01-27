// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom"; // or however you get the partyId
// import { usePartyTimer } from "../hooks/usePartyTimer";
// import { GameTimer } from "../components/GameTimer";
// import axios from "axios";

// /**
//  * Example PartyRoom:
//  *  - Connect to the real-time timer
//  *  - Display pot/middle stack (fetched from some endpoints)
//  */
// export const PartyRoom: React.FC = () => {
//     const { partyId } = useParams(); // e.g. URL like /party/123
//     const numericPartyId = Number(partyId);

//     // Our custom hook for real-time timer data
//     const { timerData, startTimer, pauseTimer, nextLevel, endTimer } =
//         usePartyTimer(numericPartyId);

//     // If you have separate endpoints for pot or middle stack, fetch them:
//     const [totalPot, setTotalPot] = useState(0);
//     const [middleStack, setMiddleStack] = useState(0);

//     // Example: fetch pot or middleStack once party is known
//     useEffect(() => {
//         if (!numericPartyId) return;
//         // e.g. GET /someEndpoint?partyId=...
//         axios
//             .get(`/api/potAndStack/${numericPartyId}`)
//             .then((res) => {
//                 setTotalPot(res.data.totalPot);
//                 setMiddleStack(res.data.middleStack);
//             })
//             .catch((err) => console.error(err));
//     }, [numericPartyId]);

//     // Extract the real-time data from timerData
//     const { status, currentBlinds, timeLeft } = timerData;
//     let smallBlind = 0,
//         bigBlind = 0,
//         ante = 0;
//     if (currentBlinds) {
//         smallBlind = currentBlinds.small;
//         bigBlind = currentBlinds.big;
//         ante = currentBlinds.ante;
//     }

//     return (
//         <div style={{ padding: 16 }}>
//             <h1>Party #{partyId} - Live Timer</h1>

//             <GameTimer
//                 status={status}
//                 timeLeft={timeLeft}
//                 smallBlind={smallBlind}
//                 bigBlind={bigBlind}
//                 ante={ante}
//                 totalPot={totalPot}
//                 middleStack={middleStack}
//                 onPauseClick={pauseTimer}
//                 onNextLevelClick={nextLevel}
//                 onEndClick={endTimer}
//             />

//             {/* 
//         If the timer hasn't been started or was ended, 
//         you might show a "Start Timer" button: 
//       */}
//             {status === "ended" && (
//                 <button onClick={() => startTimer(0)}>Restart from Level 0</button>
//             )}
//             {status === "paused" && (
//                 <button
//                     onClick={() => startTimer(currentBlinds ? timerData.levelIndex : 0)}
//                 >
//                     Resume
//                 </button>
//             )}
//         </div>
//     );
// };

// export default PartyRoom;   