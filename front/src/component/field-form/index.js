import {useState} from "react";

import "./index.css";

export default function Component({ placeholder, button, onSubmit }) {
    const [value, setValue] = useState("");

    const handleChange = (e) => setValue(e.target.value);

    const handleSubmit = () => {
        if (value.length === 0) return null;

        if (onSubmit) {
            onSubmit(value);
        } else {
            throw new Error('onSubmit props is undefined');
        }

        onSubmit(value);

        setValue("");
    };

    const isDisabled = value.length === 0;

    return (
        <div className="field-form">
            <taxtarea
                onChange={handleChange}
                value={value}
                rows={2}
                placeholder={placeholder}
                className="field-form__field"
            ></taxtarea>
            <button
                disabled={isDisabled}
                onClick={handleSubmit}
                className="field-form__button"
            >
                {button}
            </button>
        </div>
    );
}