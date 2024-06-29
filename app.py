from flask import Flask, render_template, request
import google.generativeai as genai

model = genai.GenerativeModel('gemini-pro')
my_api_key_gemini = "AIzaSyD1GOinR2fNdbFLRk78XcCS2jddQzRP0BQ"
genai.configure(api_key=my_api_key_gemini)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    try:
        ingredients = request.form['ingredients']
        meal_type = request.form['mealType']
        cuisine = request.form['cuisine']
        cooking_time = request.form['cookingTime']
        complexity = request.form['complexity']
        recipe_type = request.form['recipeType']
        extra_details = request.form['extraDetails']  

        prompt = f"""Generate a {meal_type} recipe with {ingredients} for {cuisine} cuisine. Cooking time should be {cooking_time} and complexity {complexity}.
        Recipe Type: {recipe_type}  # Include recipe type in prompt
        Extra Details: {extra_details}  # Include extra details in prompt
        and also give me this data Calorie Data
Nutrient Data,
Protein,
Fats,
Carbohydrates,
        """

        response = model.generate_content(prompt)

        if response.text:
            return response.text
        else:
            return "Sorry, could not generate the recipe."
    except Exception as e:
        print(e)
        return "Sorry, could not generate the recipe."

if __name__ == '__main__':
    app.run(debug=True)
