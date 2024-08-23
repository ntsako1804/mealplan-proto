import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library

const APP_ID = '9925f74c'; // Replace with your Edamam APP ID
const APP_KEY = 'f4fd6bcb931446525fafd7e5e8434dbe'; // Replace with your Edamam APP Key

const MealPlan = () => {
    const [meals, setMeals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dietType, setDietType] = useState('low-carb'); // Default to 'low-carb'
    const [open, setOpen] = useState(false); // For controlling dropdown visibility
    const [carbLimits, setCarbLimits] = useState({
        breakfast: 10,
        lunch: 20,
        dinner: 20,
        snack: 5, // Adding a snack category with a lower carb limit
    });

    const navigation = useNavigation();

    const fetchRecipes = async (mealType, diet, carbLimit) => {
        try {
            const response = await fetch(
                `https://api.edamam.com/search?q=&diet=${diet}&mealType=${mealType}&app_id=${APP_ID}&app_key=${APP_KEY}&maxCarbs=${carbLimit}`
            );
            const data = await response.json();
            return data.hits.map((hit) => hit.recipe);
        } catch (error) {
            console.error(error);
            setLoading(false); // Stop loading in case of an error
        }
    };

    const generateMealPlan = async () => {
        const mealPlan = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: [],
        };

        for (const mealType in carbLimits) {
            const recipes = await fetchRecipes(
                mealType,
                dietType,
                carbLimits[mealType]
            );

            if (recipes && recipes.length > 0) {
                const selectedRecipes = recipes
                    .filter((recipe) => recipe.totalNutrients.CHOCDF.quantity <= carbLimits[mealType])
                    .slice(0, 2); // Limit to top 2

                selectedRecipes.forEach((recipe) => {
                    mealPlan[mealType].push({
                        title: recipe.label,
                        servings: recipe.yield,
                        calories: recipe.calories,
                        protein: recipe.totalNutrients.PROCNT.quantity.toFixed(1),
                        fat: recipe.totalNutrients.FAT.quantity.toFixed(1),
                        carb: recipe.totalNutrients.CHOCDF.quantity.toFixed(1),
                        image: recipe.image, // Updated to be a string URL
                        dietLabels: recipe.dietLabels || [], // Include diet labels
                        cholesterol: recipe.totalNutrients.CHOLE.quantity.toFixed(1),
                        sodium: recipe.totalNutrients.NA.quantity.toFixed(1),
                        calcium: recipe.totalNutrients.CA.quantity.toFixed(1),
                        magnesium: recipe.totalNutrients.MG.quantity.toFixed(1),
                        potassium: recipe.totalNutrients.K.quantity.toFixed(1),
                        iron: recipe.totalNutrients.FE.quantity.toFixed(1),
                    });
                });
            } else {
                console.warn(`No recipes found for ${mealType} with ${dietType} diet`);
            }
        }

        setMeals(mealPlan);
        setLoading(false);
    };

    useEffect(() => {
        generateMealPlan();
    }, [dietType]); // Add dietType to dependency array

    const handleMealPress = (meal) => {
        navigation.navigate('RecipeDetail', {
            recipe: {
                title: meal.title,
                image: meal.image,  // Pass the image URL as a string
                dietLabels: meal.dietLabels,
                servings: meal.servings,
                calories: meal.calories,
                protein: meal.protein,
                fat: meal.fat,
                carb: meal.carb,
                cholesterol: meal.cholesterol,
                sodium: meal.sodium,
                calcium: meal.calcium,
                magnesium: meal.magnesium,
                potassium: meal.potassium,
                iron: meal.iron,
            },
        });
    };

    const refreshCategory = async (mealType) => {
        setLoading(true);
        const recipes = await fetchRecipes(mealType, dietType, carbLimits[mealType]);
        if (recipes && recipes.length > 0) {
            const selectedRecipes = recipes
                .filter((recipe) => recipe.totalNutrients.CHOCDF.quantity <= carbLimits[mealType])
                .slice(0, 2); // Limit to top 2

            setMeals((prevMeals) => ({
                ...prevMeals,
                [mealType]: selectedRecipes,
            }));
        }
        setLoading(false);
    };

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
                <DropDownPicker
                    open={open}
                    value={dietType}
                    items={[
                        { label: 'Balanced', value: 'balanced' },
                        { label: 'High-Fiber', value: 'high-fiber' },
                        { label: 'High-Protein', value: 'high-protein' },
                        { label: 'Low-Carb', value: 'low-carb' },
                        { label: 'Low-Fat', value: 'low-fat' },
                        { label: 'Low-Sodium', value: 'low-sodium' },
                    ]}
                    setOpen={setOpen}
                    setValue={setDietType}
                    containerStyle={styles.pickerContainer}
                    dropDownContainerStyle={styles.dropdown}
                />
                <Text style={styles.dayText}>Day 1</Text>
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, index) => (
                    <View key={index} style={styles.mealSection}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                            <TouchableOpacity onPress={() => refreshCategory(mealType)}>
                                <Icon name="reload" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        {meals[mealType].map((meal, idx) => (
                            <TouchableOpacity key={idx} onPress={() => handleMealPress(meal)}>
                                <View style={styles.mealContainer}>
                                    <Image source={{ uri: meal.image }} style={styles.mealImage} />
                                    <View style={styles.mealDetails}>
                                        <Text style={styles.mealTitle}>{meal.title}</Text>
                                        <Text style={styles.servings}>Servings: {meal.servings}</Text>
                                        <Text style={styles.calories}>{meal.calories.toFixed(2)} kcal</Text>
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
    pickerContainer: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: '#fafafa',
    },
    dayText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    mealSection: {
        marginBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    mealType: {
        fontSize: 20,
        fontWeight: 'bold',
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
