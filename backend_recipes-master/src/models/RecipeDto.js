class RecipeDto {
    // constructor({id, title, ingredients, instructions, cooking_time, serving_size, author_id, category_id, rating}) {
    //     this.id = id;
    //     this.title = title;
    //     this.ingredients = ingredients;
    //     this.instructions = instructions;
    //     this.cooking_time = cooking_time;
    //     this.serving_size = serving_size;
    //     this.author_id = author_id;
    //     this.category_id = category_id;
    //     this.rating = rating;
    // }
    id;
    title;
    description;
    ingredients;
    instructions;
    cooking_time;
    serving_size;
    author_id;
    category_id;
    rating;


    constructor(data) {
        Object.assign(this, data);
    }
}

module.exports = RecipeDto;