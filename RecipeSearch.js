//RecipeSearch.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchRecipes } from './apiService';

const RecipeSearch = () => {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState({ breakfast: [], lunch: [], dinner: [], snack: [] });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchInitialRecipes = async () => {
            try {
                const breakfastRecipes = await searchRecipes('breakfast');
                const lunchRecipes = await searchRecipes('lunch');
                const dinnerRecipes = await searchRecipes('dinner');
                const snackRecipes = await searchRecipes('snack');

                setRecipes({
                    breakfast: breakfastRecipes.hits || [],
                    lunch: lunchRecipes.hits || [],
                    dinner: dinnerRecipes.hits || [],
                    snack: snackRecipes.hits || [],
                });
            } catch (error) {
                console.error('Error fetching initial recipes:', error);
            }
        };

        fetchInitialRecipes();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setIsSearchActive(true);
        try {
            const results = await searchRecipes(query);
            setSearchResults(results.hits || []);
        } catch (error) {
            console.error('Error searching for recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setIsSearchActive(false);
        setQuery('');
        setSearchResults([]);
    };

    const handleRecipePress = (recipe) => {
        navigation.navigate('RecipeSearchDetails', { recipe });
    };

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleRecipePress(item.recipe)}>
            <View style={styles.recipeItem}>
                <Image
                    source={{ uri: item.recipe.image }}
                    style={styles.image}
                />
                <Text style={styles.title}>{item.recipe.label}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for a recipe..."
                value={query}
                onChangeText={setQuery}
            />
            <Button title="Search" onPress={handleSearch} disabled={loading} />
            {loading ? (
                <Text>Loading...</Text>
            ) : isSearchActive ? (
                <>
                    <Button title="Back" onPress={handleBack} />
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                    />
                </>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.categoryTitle}>Breakfast</Text>
                    <FlatList
                        horizontal
                        data={recipes.breakfast}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Text style={styles.categoryTitle}>Lunch</Text>
                    <FlatList
                        horizontal
                        data={recipes.lunch}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Text style={styles.categoryTitle}>Dinner</Text>
                    <FlatList
                        horizontal
                        data={recipes.dinner}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Text style={styles.categoryTitle}>Snack</Text>
                    <FlatList
                        horizontal
                        data={recipes.snack}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderRecipeItem}
                        showsHorizontalScrollIndicator={false}
                    />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    recipeItem: {
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        width: 200,
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RecipeSearch;
