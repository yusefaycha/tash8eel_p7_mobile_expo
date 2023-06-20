import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EventDetails from './pages/EventDetails';
import EventPage from './pages/EventsPage';

export default function App() {

  const stack = createStackNavigator()

  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{headerShown: false}}>
        <stack.Screen name='EventScreen' component={EventPage} />
        <stack.Screen name='DetailsScreen' component={EventDetails} />
      </stack.Navigator>
    </NavigationContainer>
  );
}
