import { ItemProps } from "../components/Item";

export function foodContains(food: string, foodList: ItemProps[]) {
    for(const foodName of foodList) {
        if (foodName.name.toLocaleLowerCase() === food.toLocaleLowerCase()) return true;
    }
}