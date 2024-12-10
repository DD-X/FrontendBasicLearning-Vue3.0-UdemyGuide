import { createApp } from 'vue';
import {createRouter, createWebHistory} from 'vue-router';

import App from './App.vue';
import TeamsList from './components/teams/TeamsList.vue';
import UsersList from './components/users/UsersList.vue';
import TeamMembers from './components/teams/TeamMembers.vue';
import NotFound from './components/nav/NotFound.vue';
import TeamsFooter from './components/teams/TeamsFooter.vue';
import UsersFooter from './components/users/UsersFooter.vue';

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path:'/',redirect:'/teams'},
        //{path:'/',component:TeamsList},
        //{path:'/',alias: },
        //{path:'/teams',component:TeamsList, alias: '/'},
        {
            name:'teams',
            path:'/teams',
            meta:{ needsAuth: true },
            //component:TeamsList,
            components:{default:TeamsList, footer:TeamsFooter},
            children:[
                { name:'team-members',path:':teamId',component:TeamMembers,props:true},
            ]
        },
        {
            path:'/users',
            components:{
                default:UsersList,
                footer:UsersFooter,
            },
            beforeEnter(to, from, next){
                console.log('users beforeEnter');
                console.log(to,from);
                next();
            }
        },
        {
            path:'/:notFound(.*)',
            component:NotFound
        }
        // {path:'/teams/new'}
    ],
    linkActiveClass: 'active',
    scrollBehavior(_, _2, savedPosition){
        //console.log(to,from,savedPosition);
        if(savedPosition){
            return savedPosition;
        }
        return { left: 0, top:0 }
    }
});

router.beforeEach(function(to, from, next){
    console.log('Global beforeEach');
    console.log(to,from);
    if(to.meta.needsAuth){
        console.log('Needs Auth');
        next(); //pass nothing
    }else{
        next();
    }
    
    //取消loading router加载界面
    //next(false);
    // if(to.name === 'team-members'){
    //     next();
    // }else{
    //     next({name:'team-members',params:{teamId:'t2'}});
    // }
});

router.afterEach(function(to,form){
    console.log('Global afterEach');
    console.log(to,form);
});

const app = createApp(App)

app.use(router);

app.mount('#app');
