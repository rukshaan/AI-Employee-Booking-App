import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import FormContainer from "../FormContainer";
import FormInput from "../FormInput";
import FormSubmitButton from "../FormSubmitButton";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import Client from "../../api/Client";
import { useLogin } from "../../context/LoginProvider";

const validationSchema = Yup.object({
  name: Yup.string().trim().min(3, "Invalid name!").required("Name is required!"),
  contactNo: Yup.string().trim().min(9, "Invalid Contact No").required("Contact No is required!"),
  address: Yup.string().trim().required("Address is required!"),
  age: Yup.number().min(18, "Age must be at least 18").integer("Age must be a whole number").nullable(),
});

const EmployerProfileEdit = ({ navigation }) => {
  const { profile, setProfile } = useLogin();
  const [image, setImage] = useState(profile?.profileImage || null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(base64Image);
    }
  };

  const handleUpdate = async (values, formikAction) => {
    try {
      const payload = { ...values, profileImage: image };
      const res = await Client.put(`/employers/${profile.id}`, payload);
      if (res.data.success) {
        setProfile(res.data.employer);
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", res.data.message || "Update failed!");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile!");
    } finally {
      formikAction.setSubmitting(false);
    }
  };

  const initialValues = {
    name: profile?.name || "",
    contactNo: profile?.contactNo || "",
    address: profile?.address || "",
    age: profile?.age?.toString() || "",
  };

  return (
    <ScrollView style={styles.container}>
      <FormContainer>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>Add Photo</Text>
            </View>
          )}
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleUpdate}
        >
          {({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
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
                lable="Update Profile"
              />
            </>
          )}
        </Formik>
      </FormContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#e0e0e0",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  imageButton: {
    marginTop: 10,
    backgroundColor: "#6b7cff",
    padding: 10,
    borderRadius: 10,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default EmployerProfileEdit;
