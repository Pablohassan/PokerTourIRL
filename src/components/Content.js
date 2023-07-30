import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Text, Spacer } from "@nextui-org/react";
import { Box } from "./Box.js";
import axios from 'axios';
import { useEffect, useState } from "react";
export const Content = () => {
    const [championnat, setChampionnat] = useState({ id: null, year: null });
    useEffect(() => {
        const fetchChampionnat = async () => {
            try {
                const response = await axios.get("http://localhost:3000/tournament"); // Adjust this according to your API endpoint
                // I'm assuming here that you are interested in the first championnat returned
                // Modify this as per your requirement
                setChampionnat({
                    id: response.data[0].id,
                    year: response.data[0].year
                });
            }
            catch (error) {
                console.error("Error fetching championnat: ", error);
            }
        };
        fetchChampionnat();
    }, []);
    return (_jsxs(Box, { css: { px: "$12", mt: "$8", "@xsMax": { px: "$10" } }, children: [_jsx(Text, { h3: true, css: {
                    textGradient: "45deg, $yellow700 -20%, $blue900 50%",
                }, weight: "bold", children: _jsxs("div", { children: ["Pitch Poker Tour: Saison ", championnat.id, " ", championnat.year && _jsxs("div", { children: ["Ann\u00E9e en cours: ", championnat.year] })] }) }), _jsx(Spacer, { y: 1 })] }));
};
//# sourceMappingURL=Content.js.map