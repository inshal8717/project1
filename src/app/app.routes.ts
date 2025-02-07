import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { Feature1Component } from './features/feature1/feature1.component';
import { PostItemComponent } from './features/post-item/post-item.component';
export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'feature1', component:Feature1Component},
    {path: 'post-item',component:PostItemComponent}
];
