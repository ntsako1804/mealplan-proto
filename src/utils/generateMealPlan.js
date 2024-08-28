// src/utils/generateMealPlan.js
import { fetchRecipes } from '../../services/fetchRecipes';

export const generateMealPlan = async (dietType, carbLimits, setMeals, setLoading) => {
    const mealPlan = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
    };

    for (const mealType in carbLimits) {
        const recipes = await fetchRecipes(mealType, dietType, carbLimits[mealType]);

        if (recipes && recipes.length > 0) {
            const selectedRecipes = recipes
                .filter((recipe) => recipe.totalNutrients.CHOCDF.quantity <= carbLimits[mealType])
                .slice(0, 2);

            selectedRecipes.forEach((recipe) => {
                mealPlan[mealType].push({
                    title: recipe.label,
                    servings: recipe.yield,
                    calories: recipe.calories,
                    protein: recipe.totalNutrients.PROCNT.quantity.toFixed(1),
                    fat: recipe.totalNutrients.FAT.quantity.toFixed(1),
                    carb: recipe.totalNutrients.CHOCDF.quantity.toFixed(1),
                    image: recipe.image,
                    dietLabels: recipe.dietLabels || [],
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
