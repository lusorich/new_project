import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    RestoreStateType,
    setNewPassword,
    initRestorePage,
} from '../../../m2-bll/redusers/restore-reducer';
import {Redirect, useParams} from 'react-router-dom';
import {AppRootStateType} from '../../../m2-bll/state/store';
import {useFormik} from 'formik';
import CommonButton from '../../../common/c2-CommonButton/CommonButton';
import CommonInput from '../../../common/c1-CommonInput/CommonInput';
import style from './../../../assets/style/Common.module.css';
import {PATH} from '../../routes/Routes';
import {Preloader} from "../../preloader/Preloader";

type FormikErrorType = {
    passwordConfirm?: string;
    password?: string;
};

export const NewPassword = () => {
    const dispatch = useDispatch();
    const {resetPasswordToken} = useParams<Record<string, string>>();
    const {status, isPasswordChanged} = useSelector<AppRootStateType, RestoreStateType>(state => state.restore);
    const isFetching = useSelector<AppRootStateType, boolean>(state => state.auth.isFetching);

    useEffect(() => {
        dispatch(initRestorePage());
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirm: '',
        },
        validate: (values) => {
            const errors: FormikErrorType = {};

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length > 15) {
                errors.password = 'Password must be 15 characters or less';
            } else if (values.password.length < 8) {
                errors.password = 'Password must be more than 7 characters ';
            }

            if (!values.passwordConfirm) {
                errors.passwordConfirm = 'Required';
            } else if (values.password !== values.passwordConfirm) {
                errors.passwordConfirm = 'Password and Confirm Password must be equal';
            }
            return errors;
        },

        onSubmit: (values) => {
            if (values.password === values.passwordConfirm) {
                dispatch(setNewPassword(values.password, resetPasswordToken));
            }
        },
    });

    if (isPasswordChanged) {
        return <Redirect to={PATH.LOGIN}/>
    }
    return (
        <div className={style.commonContainer}>
            <h1 className={style.title}>Set new password</h1>
            <form className={style.formBlock} onSubmit={formik.handleSubmit}>
                <div className={style.error}>{status && status}</div>
                <CommonInput
                    type={'password'}
                    label={'Password'}
                    formikFieldsProps={{...formik.getFieldProps('password')}}
                />

                {formik.touched.password && formik.errors.password ? (
                    <div className={style.registrationError}>
                        {formik.errors.password}
                    </div>
                ) : null}

                <CommonInput
                    type={'password'}
                    label={'Confirm Password'}
                    formikFieldsProps={{...formik.getFieldProps('passwordConfirm')}}
                />

                {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
                    <div className={style.registrationError}>
                        {formik.errors.passwordConfirm}
                    </div>
                ) : null}
                {isFetching ? <Preloader/> : <CommonButton type={'submit'} name={'Send'}/>}
            </form>
        </div>
    );
};
