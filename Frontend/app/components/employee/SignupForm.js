import React from "react";
import FormContainer from "../FormContainer";
import FormInput from "../FormInput";
import FormSubmitButton from "../FormSubmitButton";
import { Formik } from "formik";
import * as Yup from "yup";
import Client from "../../api/Client";
import { StyleSheet, TouchableOpacity, Image, Text, View, FlatList } from 'react-native';
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
  nic: Yup.string().trim().required("NIC is required!"),
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
    nic: "",
    workType: "General",
    age: "",
    profileImage: "",
  };

  const [workTypes, setWorkTypes] = React.useState([]);

  React.useEffect(() => {
    loadWorkTypes();
  }, []);

  const loadWorkTypes = async () => {
    try {
      const res = await Client.get('/worktypes');
      setWorkTypes(res.data);
    } catch (err) {
      console.log('Error fetching work types', err);
    }
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
    const endpoint = role === "employer" ? "/employers" : "/employees";
    const payload = { ...values, workType: values.workType || "General" };
    try {
      const res = await Client.post(endpoint, payload);
      if (res.data.success) {
        if (res.data.message && res.data.message.includes('Added new skill')) {
           alert("Skill added to your existing profile successfully! You can now log in.");
        } else {
           alert("Signup successful! You can now log in.");
        }
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
            <FormInput
              value={values.nic}
              error={touched.nic && errors.nic}
              lable="NIC"
              placeholder="199012345678"
              onChangeText={handleChange("nic")}
              onBlur={handleBlur("nic")}
            />
            <TouchableOpacity onPress={() => getLocation(setFieldValue)} style={styles.locationButton}>
              <Text style={styles.locationButtonText}>📍 Get My Current Location</Text>
            </TouchableOpacity>
            {role === "employer" ? null : (
              <View style={styles.workTypeContainer}>
                <Text style={styles.workTypeTitle}>Select Work Type</Text>
                <FlatList
                  horizontal
                  data={workTypes}
                  keyExtractor={(item) => item.id.toString()}
                  style={{ flexGrow: 0, marginBottom: 15 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.roleCard, values.workType === item.name && styles.selectedRoleCard]}
                      onPress={() => setFieldValue("workType", item.name)}
                    >
                      <Text style={[styles.roleName, values.workType === item.name && styles.selectedRoleText]}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                {touched.workType && errors.workType && <Text style={{ color: 'red', fontSize: 12 }}>{errors.workType}</Text>}
              </View>
            )}
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
  workTypeContainer: { marginHorizontal: 20, marginBottom: 15 },
  workTypeTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#334155' },
  roleCard: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginRight: 10, backgroundColor: '#f8fafc' },
  selectedRoleCard: { borderColor: '#0ea5e9', backgroundColor: '#e0f2fe' },
  roleName: { fontSize: 14, color: '#475569', fontWeight: 'bold' },
  selectedRoleText: { color: '#0369a1' },
  locationButton: {
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#91d5ff',
    marginHorizontal: 20,
  },
  locationButtonText: {
    color: '#0050b3',
    fontWeight: 'bold',
  },
});

export default SignupForm;
