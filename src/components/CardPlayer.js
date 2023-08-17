import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Button, CardHeader, Image, CardBody, CardFooter, } from "@nextui-org/react";
export const CardPlayer = ({ playername, recave, kill, rebuy, outOfGame, }) => {
    return (_jsxs(Card, { style: { width: "220px", height: "200px" }, children: [_jsx(CardHeader, { style: { position: "absolute", zIndex: 1, top: 5 }, children: _jsx("div", { children: _jsx("div", { children: playername }) }) }), _jsx(CardBody, { style: { padding: 0 }, children: _jsx(Image, { src: "https://nextui.org/images/card-example-6.jpeg", width: "100%", height: "100%", className: "z-0 w-full h-full object-cover", alt: "Card example background" }) }), _jsx(CardFooter, { style: {
                    backgroundColor: "#ffffff",
                    position: "absolute",
                    borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                    bottom: 0,
                    zIndex: 1,
                }, children: _jsxs("div", { children: [_jsxs("div", { children: [_jsxs("div", { color: "#000", children: ["Recaves:", recave] }), _jsxs("div", { color: "#000", children: ["Kills:", kill] })] }), _jsxs("div", { children: [_jsx("div", { children: _jsx(Button, { size: "sm", variant: "bordered", color: "secondary", onPress: rebuy, children: _jsx("div", { style: {
                                                color: "inherit",
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                textTransform: "capitalize",
                                            }, children: "recave" }) }) }), _jsx("div", { children: _jsx(Button, { size: "sm", variant: "bordered", color: "secondary", onPress: outOfGame, children: _jsx("div", { style: {
                                                color: "inherit",
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                textTransform: "capitalize",
                                            }, children: "Elimin\u00E9" }) }) })] })] }) })] }));
};
//# sourceMappingURL=CardPlayer.js.map