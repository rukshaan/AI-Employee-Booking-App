import React from "react";
import FormContainer from "../FormContainer";
import FormInput from "../FormInput";
import FormSubmitButton from "../FormSubmitButton";
import { Formik } from "formik";
import * as Yup from "yup";
import Client from "../../api/Client";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Invalid name!")
    .required("Name is required!"),
  email: Yup.string()
    .trim()
    .transform((value) => value?.replace(/\s+/g, ""))
    .email("Invalid email")
    .required("Email is required!"),
  password: Yup.string()
    .trim()
    .min(8, "Password is too short!")
    .required("Password is required!"),
  confirmPassword: Yup.string().equals(
    [Yup.ref("password"), null],
    "Password does not match!",
  ),
  contactNo: Yup.string()
    .trim()
    .min(9, "Invalid Contact No")
    .required("Contact No is required!"),
  address: Yup.string().trim().required("Address is required!"),
  workType: Yup.string().trim().required("Work type is required!"),
  age: Yup.number().min(18, "Age must be at least 18").integer("Age must be a whole number").nullable(),
});

const SignupForm = ({ role, onSuccess }) => {
  const userInfo = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNo: "",
    address: "",
    workType: "General",
    age: "",
  };

  const signUp = async (values, formikAction) => {
    const endpoint = role === "employer" ? "/employers" : "/employees";
    const payload = { ...values, workType: values.workType || "General" };
    try {
      const res = await Client.post(endpoint, payload);
      if (res.data.success) {
        alert("Signup successful! You can now log in.");
        onSuccess && onSuccess();
      } else {
        alert(res.data.message || "Signup failed. Please check your information and try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || "Signup failed. Please check your information and try again.";
      alert(errorMessage);
    } finally {
      formikAction.resetForm();
      formikAction.setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <FormInput
              value={values.name}
              error={touched.name && errors.name}
              lable="Full Name"
              placeholder="John Smith"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
            />
            <FormInput
              value={values.email}
              error={touched.email && errors.email}
              autoCapitalize="none"
              lable="Email"
              placeholder="example@gmail.com"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            <FormInput
              value={values.password}
              error={touched.password && errors.password}
              autoCapitalize="none"
              secureTextEntry
              lable="Password"
              placeholder="********"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            <FormInput
              value={values.confirmPassword}
              error={touched.confirmPassword && errors.confirmPassword}
              autoCapitalize="none"
              secureTextEntry
              lable="Confirm Password"
              placeholder="********"
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
            />
            <FormInput
              value={values.contactNo}
              error={touched.contactNo && errors.contactNo}
              autoCapitalize="none"
              lable="Contact No"
              placeholder="+94 123456789"
              onChangeText={handleChange("contactNo")}
              onBlur={handleBlur("contactNo")}
            />
            <FormInput
              value={values.address}
              error={touched.address && errors.address}
              lable="Address"
              placeholder="214 2nd Cross Street, Colombo, SriLanka"
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
            />
            <FormInput
              value={values.workType}
              error={touched.workType && errors.workType}
              lable="Work Type"
              placeholder="General"
              onChangeText={handleChange("workType")}
              onBlur={handleBlur("workType")}
            />
            <FormInput
              value={values.age}
              error={touched.age && errors.age}
              lable="Age"
              placeholder="25"
              keyboardType="numeric"
              onChangeText={handleChange("age")}
              onBlur={handleBlur("age")}
            />
            <FormSubmitButton
              submitting={isSubmitting}
              onPress={handleSubmit}
              lable="Sign up"
            />
          </>
        )}
      </Formik>
    </FormContainer>
  );
};

export default SignupForm;
