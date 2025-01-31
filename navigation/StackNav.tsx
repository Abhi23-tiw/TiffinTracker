import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "../components/Register";
import Main from "../components/Main";
import Login from "../components/Login";
import Onboarding1 from "../components/Onboarding1";
import Forgot from "../components/Forgot";
import ResetPassword from "../components/ResetPassword";
import ChangePassword from "../components/ChangePassword";

export const StackNav = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Onboard1">
      <Stack.Screen
        name="Onboard1"
        component={Onboarding1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Forgot"
        component={Forgot}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reset"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="otpverified"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
};
