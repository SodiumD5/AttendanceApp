import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Colors from "./components/Colors";

import StartPage from "./page/StartPage";
import AttendenceList from "./page/AttendenceList";
import Attendence from "./page/Attendence";
import Login from "./page/Login";
import AdminMenu from "./page/AdminMenu"
import CheckAttendenceRecord from "./page/CheckAttendenceRecord";
import AnnualLedger from "./page/AnnualLedger";
import Manage from "./page/Manage";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="StartPage"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="StartPage" component={StartPage} />
                <Stack.Screen
                    name="AttendenceList"
                    component={AttendenceList}
                />
                <Stack.Screen name="Attendence" component={Attendence} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="AdminMenu" component={AdminMenu} />

                <Stack.Screen name="CheckAttendenceRecord" component={CheckAttendenceRecord} />
                <Stack.Screen name="AnnualLedger" component={AnnualLedger} />
                <Stack.Screen name="Manage" component={Manage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({});
