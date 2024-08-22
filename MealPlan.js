import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const APP_ID = '9925f74c'; // Replace with your Edamam APP ID
const APP_KEY = 'f4fd6bcb931446525fafd7e5e8434dbe'; // Replace with your Edamam APP Key

const MealPlan = () => {
    const [meals, setMeals] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const dietType = 'low-carb'; // Fixed dietary preference

    const handleMealPress = (meal) => {
        navigation.navigate('RecipeDetail', { recipe: meal });
    };

    const mealCarbLimits = {
        breakfast: 10,
        lunch: 20,
        dinner: 20,
        snack: 5, // Adding a snack category with a lower carb limit
    };

    async function fetchRecipes(mealType, diet, carbLimit) {
        try {
            const response = await fetch(
                `https://api.edamam.com/search?q=&diet=${diet}&mealType=${mealType}&app_id=${APP_ID}&app_key=${APP_KEY}&maxCarbs=${carbLimit}`
            );
            const data = await response.json();
            console.log(data); // Log the response data
            return data.hits.map((hit) => hit.recipe);
        } catch (error) {
            console.error(error);
            setLoading(false); // Stop loading in case of an error
        }
    }

    useEffect(() => {
        async function generateMealPlan() {
            const mealPlan = {
                breakfast: [],
                lunch: [],
                dinner: [],
                snack: [],
            };

            for (const mealType in mealCarbLimits) {
                const recipes = await fetchRecipes(
                    mealType,
                    dietType,
                    mealCarbLimits[mealType]
                );

                if (recipes && recipes.length > 0) {
                    // Select top 2 recipes
                    const selectedRecipes = recipes
                        .filter((recipe) => recipe.totalNutrients.CHOCDF.quantity <= mealCarbLimits[mealType])
                        .slice(0, 2); // Limit to top 2

                    selectedRecipes.forEach((recipe) => {
                        mealPlan[mealType].push({
                            title: recipe.label,
                            servings: recipe.yield,
                            calories: recipe.calories,
                            protein: recipe.totalNutrients.PROCNT.quantity.toFixed(1),
                            fat: recipe.totalNutrients.FAT.quantity.toFixed(1),
                            carb: recipe.totalNutrients.CHOCDF.quantity.toFixed(1),
                            image: { uri: recipe.image },
                        });
                    });
                } else {
                    console.warn(`No recipes found for ${mealType} with ${dietType} diet`);
                }
            }

            setMeals(mealPlan);
            setLoading(false);
        }

        generateMealPlan();
    }, []); // No need to track dietType since it's fixed

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.dayText}>Day 1</Text>
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, index) => (
                    <View key={index} style={styles.mealSection}>
                        <Text style={styles.mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                        {meals[mealType].map((meal, idx) => (
                            <TouchableOpacity key={idx} onPress={() => handleMealPress(meal)}>
                                <View style={styles.mealContainer}>
                                    <Image source={meal.image} style={styles.mealImage} />
                                    <View style={styles.mealDetails}>
                                        <Text style={styles.mealTitle}>{meal.title}</Text>
                                        <Text style={styles.servings}>Servings: {meal.servings}</Text>
                                        <Text style={styles.calories}>{meal.calories} kcal</Text>
                                        <Text style={styles.nutritionalInfo}>PROTEIN: {meal.protein} g</Text>
                                        <Text style={styles.nutritionalInfo}>FAT: {meal.fat} g</Text>
                                        <Text style={styles.nutritionalInfo}>CARB: {meal.carb} g</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        padding: 20,
    },
    dayText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mealSection: {
        marginBottom: 20,
    },
    mealType: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mealContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    mealImage: {
        width: 80,
        height: 80,
    },
    mealDetails: {
        padding: 10,
        flex: 1,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    servings: {
        fontSize: 14,
        marginBottom: 5,
    },
    calories: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 5,
    },
    nutritionalInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MealPlan;
