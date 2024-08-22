import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const RecipeDetail = ({ route }) => {
    const { recipe } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.dietLabels}>
                {recipe.dietLabels ? recipe.dietLabels.join(' • ') : 'No diet labels available'}
            </Text>
            <Text style={styles.servings}>Servings: {recipe.servings}</Text>
            <Text style={styles.calories}>{recipe.calories} kcal</Text>

            <View style={styles.nutrientsContainer}>
                <Text style={styles.nutrient}>PROTEIN: {recipe.protein} g</Text>
                <Text style={styles.nutrient}>FAT: {recipe.fat} g</Text>
                <Text style={styles.nutrient}>CARB: {recipe.carb} g</Text>
            </View>

            <View style={styles.nutrientsContainer}>
                <Text style={styles.nutrient}>Cholesterol: {recipe.cholesterol} mg</Text>
                <Text style={styles.nutrient}>Sodium: {recipe.sodium} mg</Text>
                <Text style={styles.nutrient}>Calcium: {recipe.calcium} mg</Text>
                <Text style={styles.nutrient}>Magnesium: {recipe.magnesium} mg</Text>
                <Text style={styles.nutrient}>Potassium: {recipe.potassium} mg</Text>
                <Text style={styles.nutrient}>Iron: {recipe.iron} mg</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dietLabels: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    servings: {
        fontSize: 16,
        marginBottom: 10,
    },
    calories: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    nutrientsContainer: {
        marginBottom: 20,
    },
    nutrient: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
});

export default RecipeDetail;
