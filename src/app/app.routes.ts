import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Patientlist } from './patient/patientlist/patientlist';
import { Addpatient } from './addpatient/addpatient';
import { Viewpatient } from './viewpatient/viewpatient';

export const routes: Routes = [
    {
        path:'', component: Home
    },
    {
        path:'patient', component: Patientlist
    },
    {
        path:'addpatient', component: Addpatient
    },
    {
        path:'editpatient/:id', component: Addpatient
    },
    {
        path:'viewpatient/:id', component: Viewpatient
    }
];
