import React, { useRef } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import FormHeader from '../employee/FormHeader';
import FormSelectorBtn from '../FormSelectorBtn';
import EmployeerLoginForm from './EmployeerLoginForm';
import EmployerSignupForm from './EmployerSignupForm';
import HomeBtn from '../HomeBtn';
import { StackActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const EmployeerAppForm = ({ navigation }) => {
  const animation = useRef(new Animated.Value(0)).current;
  const scrollview = useRef();

  const rightHeaderOpacity = animation.interpolate({ inputRange: [0, width], outputRange: [1, 0] });
  const leftHeaderTranslateX = animation.interpolate({ inputRange: [0, width], outputRange: [0, 40] });
  const rightHeaderTranslateY = animation.interpolate({ inputRange: [0, width], outputRange: [0, -20] });
  const loginColorInterpolate = animation.interpolate({ inputRange: [0, width], outputRange: ['rgba(27,27,51,1)', 'rgba(27,27,51,0.4)'] });
  const signupColorInterpolate = animation.interpolate({ inputRange: [0, width], outputRange: ['rgba(27,27,51,0.4)', 'rgba(27,27,51,1)'] });

  const welcomePage = () => navigation.dispatch(StackActions.replace('WelcomePage'));

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.headerGlow} />
        <HomeBtn onPress={welcomePage} />
      </View>
      <View style={styles.headerBox}>
        <FormHeader leftHeading='Sign In' rightHeading='Create Account' subHeading='Customer Portal' rightHeaderOpacity={rightHeaderOpacity} leftHeaderTranslateX={leftHeaderTranslateX} rightHeaderTranslateY={rightHeaderTranslateY} />
      </View>
      <View style={styles.switchRow}>
        <FormSelectorBtn style={styles.borderLeft} backgroundColor={loginColorInterpolate} lable='Login' onPress={() => scrollview.current.scrollTo({ x: 0 })} />
        <FormSelectorBtn style={styles.borderRight} backgroundColor={signupColorInterpolate} lable='Sign Up' onPress={() => scrollview.current.scrollTo({ x: width })} />
      </View>
      <ScrollView ref={scrollview} horizontal pagingEnabled showsHorizontalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: animation } } }], { useNativeDriver: false })} style={styles.formScroll}>
        <View style={styles.page}><EmployeerLoginForm /></View>
        <View style={styles.page}><EmployerSignupForm /></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f7ff' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  headerGlow: { flex: 1, height: 48, position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#eef2ff' },
  headerBox: { height: 92, justifyContent: 'center', marginBottom: 6 },
  switchRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, marginTop: 2 },
  borderLeft: { borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  borderRight: { borderTopRightRadius: 16, borderBottomRightRadius: 16 },
  formScroll: { flex: 1 },
  page: { width, paddingBottom: 24 },
});

export default EmployeerAppForm;
