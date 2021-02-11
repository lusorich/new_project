import React, {DetailedHTMLProps, InputHTMLAttributes} from "react";
import s from "./CommonInput.module.css";

// тип пропсов обычного инпута
type DefaultInputPropsType = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

// здесь мы говорим что у нашего инпута будут такие же пропсы как у обычного инпута
// (чтоб не писать value: string, onChange: ...; они уже все описаны в DefaultInputPropsType)
type SuperInputTextPropsType = DefaultInputPropsType & { // и + ещё пропсы которых нет в стандартном инпуте
    label?: string
    formikFieldsProps?: any
    error?: any
};

const CommonInput: React.FC<SuperInputTextPropsType> = (
    {
        type, // достаём и игнорируем чтоб нельзя было задать другой тип инпута
        formikFieldsProps,
        label,
        error,
        ...restProps// все остальные пропсы попадут в объект restProps
    }
) => {

    return (
        <>
            <div className={s.group}>
                <input
                    type={type}
                    {...formikFieldsProps}
                    required
                />
                <span className={s.highlight}> </span>
                <span className={s.bar}> </span>
                <label>{label}</label>
            </div>
        </>
    );
}

export default CommonInput;
