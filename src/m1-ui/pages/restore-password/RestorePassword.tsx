import React, { useCallback, useEffect } from 'react';
import {
  initRestorePage,
  restorePassword,
  RestoreStateType,
} from '../../../m2-bll/redusers/restore-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from '../../../m2-bll/state/store';
import { useFormik } from 'formik';
import CommonButton from '../../../common/c2-CommonButton/CommonButton';
import CommonInput from '../../../common/c1-CommonInput/CommonInput';
import style from './../../../assets/style/Common.module.css';

type FormikErrorType = {
  email?: string;
};

export const RestorePassword = () => {
  const dispatch = useDispatch();
  const { error, currentEmail } = useSelector<
    AppRootStateType,
    RestoreStateType
  >((state) => state.restore);

  const submitRestorePassword = useCallback(
    (currentEmail) => {
      dispatch(restorePassword(currentEmail));
    },
    [currentEmail]
  );

  useEffect(() => {
    dispatch(initRestorePage);
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate: (values) => {
      const errors: FormikErrorType = {};

      if (!values.email) {
        errors.email = 'Required';
      } else if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)/.test(
          values.email
        )
      ) {
        return undefined;
      } else {
        errors.email = 'Write correct email';
      }

      return errors;
    },

    onSubmit: (values) => {
      submitRestorePassword(values.email);
    },
  });

  return (
    <div>
      <h1 className={style.title}>Set new password</h1>
      <form className={style.formBlock} onSubmit={formik.handleSubmit}>
        <div className={style.error}>{error ? error : null}</div>

        <CommonInput
          type={'text'}
          label={'email'}
          error={error || formik.errors}
          formikFieldsProps={{ ...formik.getFieldProps('email') }}
        />

        {formik.touched.email && formik.errors.email ? (
          <div className={style.registrationError}>{formik.errors.email}</div>
        ) : null}

        <CommonButton type={'submit'} name={'Send request'} />
      </form>
    </div>
  );
};
