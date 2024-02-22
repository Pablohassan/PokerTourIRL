import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Button, CardHeader, Image, CardFooter, } from "@nextui-org/react";
export const CardPlayer = ({ playername, recave, kill, rebuy, outOfGame, }) => {
    return (_jsxs(Card, { style: { width: "100px", height: "180px" }, children: [_jsx(CardHeader, { style: { position: "absolute", zIndex: 1, top: 5 }, children: _jsx("div", { style: { fontSize: 12, fontWeight: "bold",
                        textTransform: "capitalize" }, children: playername }) }), _jsx(Image, { src: "https://nextui.org/images/card-example-6.jpeg", width: "100%", height: "100%", className: "z-0 w-full h-full object-cover", alt: "Card example background" }), _jsx(CardFooter, { style: {
                    backgroundColor: "#ffffff",
                    position: "absolute",
                    borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                    bottom: 0,
                    zIndex: 1,
                }, children: _jsxs("div", { children: [_jsxs("div", { children: [_jsxs("div", { className: "text-lg", color: "#000", children: ["Recaves:", recave] }), _jsxs("div", { className: "text-lg", color: "#000", children: ["Kills:", kill] })] }), _jsxs("div", { children: [_jsx("div", { children: _jsx(Button, { size: "sm", variant: "bordered", fullWidth: true, color: "secondary", onClick: (e) => {
                                            rebuy();
                                            e.currentTarget.blur(); // Add this line to blur the button
                                        }, children: _jsx("div", { style: {
                                                color: "inherit",
                                                textAlign: "center",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                            }, children: "recave" }) }) }), _jsx("div", { className: "p1", children: _jsx(Button, { style: { marginTop: "2px" }, size: "sm", variant: "bordered", fullWidth: true, color: "secondary", onClick: (e) => {
                                            outOfGame();
                                            e.currentTarget.blur(); // Add this line to blur the button
                                        }, children: _jsx("div", { style: {
                                                color: "inherit",
                                                fontSize: 13,
                                                fontWeight: "bold",
                                                textTransform: "capitalize",
                                            }, children: "Elimin\u00E9" }) }) })] })] }) })] }));
};
//# sourceMappingURL=CardPlayer.js.map