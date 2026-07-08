import React from "react";
import FormContainer from "../FormContainer";
import FormInput from "../FormInput";
import FormSubmitButton from "../FormSubmitButton";
import { Formik } from "formik";
import * as Yup from "yup";
import Client from "../../api/Client";
import { useLogin } from "../../context/LoginProvider";

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .transform((value) => value?.replace(/\s+/g, ""))
    .email("Invalid email")
    .required("Email is required!"),
  password: Yup.string()
    .trim()
    .min(8, "Password is too short!")
    .required("Password is required!"),
});

const EmployeerLoginForm = ({ onSuccess }) => {
  const { setEmployerLoggedIn, setProfile } = useLogin();
  const userInfo = { email: "", password: "" };

  const signIn = async (values, formikAction) => {
    const res = await Client.post("/employers/signin", values);
    if (res.data.success) {
      setProfile(res.data.employer);
      setEmployerLoggedIn(true);
      onSuccess && onSuccess();
    } else {
      alert(res.data.message || "Login failed");
    }
    formikAction.resetForm();
    formikAction.setSubmitting(false);
  };

  return (
    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signIn}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleSubmit,
        }) => (
          <>
            <FormInput
              value={values.email}
              error={touched.email && errors.email}
              onChangeText={handleChange("email")}
              lable="Email"
              placeholder="example@gmail.com"
              autoCapitalize="none"
            />
            <FormInput
              value={values.password}
              error={touched.password && errors.password}
              onChangeText={handleChange("password")}
              lable="Password"
              placeholder="********"
              autoCapitalize="none"
              secureTextEntry
            />
            <FormSubmitButton
              lable="Login"
              submitting={isSubmitting}
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </FormContainer>
  );
};

export default EmployeerLoginForm;
