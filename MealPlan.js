import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { generateMealPlan } from './src/utils/generateMealPlan';
import { refreshCategory } from './src/utils/refreshCategory';

const MealPlan = () => {
    const [meals, setMeals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dietType, setDietType] = useState('low-carb');
    const [open, setOpen] = useState(false);
    const [carbLimits, setCarbLimits] = useState({
        breakfast: 10,
        lunch: 20,
        dinner: 20,
        snack: 5,
    });

    const navigation = useNavigation();

    useEffect(() => {
        generateMealPlan(dietType, carbLimits, setMeals, setLoading);
    }, [dietType]);

    const handleMealPress = (meal) => {
        navigation.navigate('RecipeDetail', {
            recipe: meal,
        });
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
                            <TouchableOpacity onPress={() => refreshCategory(mealType, dietType, carbLimits, setMeals, setLoading)}>
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