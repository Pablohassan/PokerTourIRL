import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
function AddPlayer() {
    const [name, setName] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/player", { name });
            console.log(response.data); // new player info
        }
        catch (error) {
            console.error(error);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("label", { children: ["Player name:", _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true })] }), _jsx("button", { type: "submit", children: "Add Player" })] }));
}
export default AddPlayer;
//# sourceMappingURL=CreatePlayer.js.map