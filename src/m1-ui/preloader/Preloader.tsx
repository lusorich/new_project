import React from "react";
import preloader from "./../../assets/images/preloader.gif";
import style from "./Preloader.module.css"

export const Preloader = () => {
    return (
        <div className={style.preloaderContainer}>
            <img src={preloader} alt="preloader"/>
        </div>
    )
}