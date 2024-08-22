import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MealPlan from './MealPlan';
import RecipeDetail from './RecipeDetails';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="MealPlan" component={MealPlan} />
                <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
