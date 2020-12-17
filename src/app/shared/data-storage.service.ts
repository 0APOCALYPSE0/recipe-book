import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private API_URL:string = "https://recipe-book-bc908-default-rtdb.firebaseio.com/";

  constructor(private http:HttpClient, private recipeService:RecipeService, private authService:AuthService) { }

  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    return this.http.put(this.API_URL+"recipes.json", recipes).subscribe(responseData => {});
  }

  fetchRecipes(){
      return this.http.get<Recipe[]>(this.API_URL+"recipes.json").pipe(map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients? recipe.ingredients : [] };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }));
  }

}
