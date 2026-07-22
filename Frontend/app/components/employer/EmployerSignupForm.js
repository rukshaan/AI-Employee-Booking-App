import React from "react";
import FormContainer from "../FormContainer";
import FormInput from "../FormInput";
import FormSubmitButton from "../FormSubmitButton";
import { Formik } from "formik";
import * as Yup from "yup";
import Client from "../../api/Client";
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

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
  age: Yup.number().min(18, "Age must be at least 18").integer("Age must be a whole number").nullable(),
});

const EmployerSignupForm = ({ onSuccess }) => {
  const userInfo = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNo: "",
    address: "",
    age: "",
    profileImage: "",
  };

  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setFieldValue('profileImage', `data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const getLocation = async (setFieldValue) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      if (reverseGeocode.length > 0) {
        let addr = reverseGeocode[0];
        let addressString = `${addr.name ? addr.name + ', ' : ''}${addr.street ? addr.street + ', ' : ''}${addr.city ? addr.city + ', ' : ''}${addr.country || ''}`.replace(/,\s*$/, "");
        setFieldValue('address', addressString);
      }
    } catch (error) {
      console.log('Error fetching location:', error);
      alert('Could not fetch location. Please try again.');
    }
  };

  const signUp = async (values, formikAction) => {
    try {
      const res = await Client.post("/employers", values);
      if (res.data.success) {
        alert("Signup successful! You can now log in.");
        formikAction.resetForm();
        onSuccess && onSuccess();
      } else {
        alert(res.data.message || "Signup failed. Please check your information and try again.");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Signup failed. Please try again.";
      alert(message);
    } finally {
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
          setFieldValue,
        }) => (
          <>
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity onPress={() => pickImage(setFieldValue)} style={styles.imagePicker}>
                {values.profileImage ? (
                  <Image source={{ uri: values.profileImage }} style={styles.profileImage} />
                ) : (
                  <Text style={styles.imagePickerText}>Add Profile Image</Text>
                )}
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity onPress={() => getLocation(setFieldValue)} style={styles.locationButton}>
              <Text style={styles.locationButtonText}>📍 Get My Current Location</Text>
            </TouchableOpacity>
            <FormInput
              value={values.age}
              error={touched.age && errors.age}
              lable="Age"
              placeholder="30"
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


const styles = StyleSheet.create({
  imagePickerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePickerText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
  },
  locationButton: {
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#91d5ff',
  },
  locationButtonText: {
    color: '#0050b3',
    fontWeight: 'bold',
  },
});

export default EmployerSignupForm;
