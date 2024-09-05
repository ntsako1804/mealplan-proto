import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Switch } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { generateMealPlan } from './src/utils/generateMealPlan';
import { refreshCategory } from './src/utils/refreshCategory';
import moment from 'moment';



const MealPlan = () => {
    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    });
    const [loading, setLoading] = useState(true);
    const [dietType, setDietType] = useState('low-carb');
    const [open, setOpen] = useState(false);
    const [carbLimits, setCarbLimits] = useState({
        breakfast: 10,
        lunch: 20,
        dinner: 20,
        snack: 5,
    });
    const [eatenMeals, setEatenMeals] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: false,
    });

    const navigation = useNavigation();

    useEffect(() => {
        generateMealPlan(dietType, setMeals, setLoading);
    }, [dietType]);

    const handleMealPress = (meal) => {
        navigation.navigate('RecipeDetail', {
            recipe: meal,
        });
    };

    const handleSwitchChange = (mealType) => {
        setEatenMeals((prevEatenMeals) => ({
            ...prevEatenMeals,
            [mealType]: !prevEatenMeals[mealType],
        }));
    };

    const totalNutrients = ['calories', 'protein', 'fat', 'carb'].reduce(
        (totals, nutrient) => {
            Object.keys(meals).forEach((mealType) => {
                if (eatenMeals[mealType]) {
                    meals[mealType].forEach((meal) => {
                        totals[nutrient] += parseFloat(meal[nutrient]) || 0;
                    });
                }
            });
            return totals;
        },
        { calories: 0, protein: 0, fat: 0, carb: 0 }
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    const currentDate = moment().format('dddd, DD MMMM YYYY');
    const currentDay = moment().date();

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.dateContainer}>
                    <Icon name="calendar-outline" size={24} color="#fff" />
                    <Text style={styles.dateText}>{currentDate}</Text>
                </View>
                <View style={styles.dayContainer}>
                    {Array.from({ length: 7 }).map((_, index) => (
                        <Text key={index} style={[styles.dayText, index === 3 && styles.selectedDay]}>
                            {currentDay - 3 + index}
                        </Text>
                    ))}
                </View>

                <DropDownPicker
                    open={open}
                    value={dietType}
                    items={[
                        { label: 'Low-Carb', value: 'low-carb' },
                        { label: 'High-Protein', value: 'high-protein' },
                        { label: 'Balanced', value: 'balanced' },
                        { label: 'Low-Fat', value: 'low-fat' },
                        { label: 'Low-Sodium', value: 'low-sodium' },
                    ]}
                    setOpen={setOpen}
                    setValue={setDietType}
                    containerStyle={styles.pickerContainer}
                    dropDownContainerStyle={styles.dropdown}
                />
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, index) => (
                    <View key={index} style={styles.mealSection}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                            <TouchableOpacity onPress={() => refreshCategory(mealType, dietType, carbLimits, setMeals, setLoading)}>
                                <Icon name="reload" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Switch
                            value={eatenMeals[mealType]}
                            onValueChange={() => handleSwitchChange(mealType)}
                        />
                        {meals[mealType] && meals[mealType].map((meal, idx) => (
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
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>Nutritional Summary:</Text>
                    <Text style={styles.summaryText}>Calories: {totalNutrients.calories.toFixed(2)} kcal</Text>
                    <Text style={styles.summaryText}>Protein: {totalNutrients.protein.toFixed(2)} g</Text>
                    <Text style={styles.summaryText}>Fat: {totalNutrients.fat.toFixed(2)} g</Text>
                    <Text style={styles.summaryText}>Carbs: {totalNutrients.carb.toFixed(2)} g</Text>
                </View>
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
    summaryContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#1A1A1A',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    dateText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    dayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dayText: {
        color: '#fff',
        fontSize: 16,
        marginHorizontal: 5,
    },
    selectedDay: {
        color: '#00BFFF', // Highlight the selected day
    },
});

export default MealPlan;
