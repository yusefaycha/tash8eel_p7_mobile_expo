import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import EventPage from './pages/EventsPage'
import EventDetails from './pages/EventDetails';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const stack = createStackNavigator()

  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{headerShown: false}}>
        <stack.Screen name='EventScreen' component={EventPage} />
        <stack.Screen name='DetailsScreen' component={EventDetails} />
      </stack.Navigator>
    </NavigationContainer>
    // <EventPage />
    // <EventDetails />
    // <View style={styles.container}>
    //   <Text>Hello Youssef</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
