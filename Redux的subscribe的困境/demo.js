/**
 * Created by zhouzhen on 2016/12/23.
 */
//引入redux命名空间下的方法 createStore、combineReducers，分配用于创建store和集成reducer函数
// const $=require('jquery');
// const redux=require('redux');
// const createStore=redux.createStore;
// const combineReducers=redux.combineReducers;
//用ES6的模块化
//import $ from 'jquery'
const $=require('jquery');

import {createStore,combineReducers} from 'redux';
$.ajax({
    url:'/posts'
})
const InitState={//初始的全局state，从服务端传来
    zhouzhen:{},
    liangwei:{},
    yangtong:[],
    qinqin:1
};

function zhouzhen(state={},action){     //reducer的函数名需要跟state对象的属性对应。
    switch (action.type){//通过swtich语句来判断action.type来做处理返回state
        case "CHANGE_ZHOUZHEN":
            return {...state, [action.params.type]:action.params.value};//ES2017的解构赋值方法
        case "DEL_ZHOUZHEN":
            let newState=Object.assign({},state);//ES6的assign方法克隆一份state，绝不直接改变原state
            delete newState[action.params.type];//删除state的某个属性
            return newState;
        default:
            return state;//默认返回原state
    }
}

function liangwei(state={},action) {
    if(action.type=="CHANGE_LIANGWEI_NAME"){//当然也可以通过if else语句来判断逻辑
        if(!$.isEmptyObject(state)){
            return state
        }
        // return $.extend({},state,{//当然也可以用jquery的extend方法合并属性
        //     names:action.names
        // })
        return Object.assign({},state,{names:action.names})
    }else if(action.type=="DEL_LIANGWEI_HAIR"){
        let newState=Object.assign({},state);
        newState.hair=null;
        return newState
    }else{
        return state;
    }

}

function yangtong(state=[],action) {
    switch (action.type){
        case "ADD_YANGTONG":
            return state.concat(action.item);//concat方法返回新数组，而不能用push，改变原state
        default:
            return state;
    }
}

function qinqin(state=1,action){
    switch (action.type){
        case "ADD_QINQIN":
            return ++state;
        case "RETURN_QINAIN":
            return action.value||state;
        default:
            return state
    }
}

const reducers=combineReducers({//合并reducer函数，后期函数多了可以拆分开多个文件引入
    zhouzhen,
    liangwei,
    yangtong,
    qinqin
});

//把合并好的reducers函数和初始状态state传入到createStore方法中，可以生成并返回
const store=createStore(reducers,InitState);    //此处省略了可以传的第三个参数，支持传入中间件


//利用store的dispatch方法派发一个action
let action1={
    type:"CHANGE_ZHOUZHEN",
    params:{
        type:"sex",
        value:"man"
    }
};
store.dispatch(action1);


//利用store的subscribe方法进行监听全局的state状态改变
var listner1=store.subscribe(function () {
    console.log("listener1",store.getState());  //getStore随处都可以调用，而不是一定在这个回调函数中才能调用到
});
//上面的返回的listner1，有一个unsubscribe方法，调用一下就移除了监听
setTimeout(function () {
    listner1.unsubscribe()
},10000);



//进阶的是 在页面不应用react的时候，我们想要某一个模块获取和监听到state的某一部分，而不是state的全部属性，我们可以对subscribe进行扩展；
//是这样一个函数，我们监听的加强版，需要传入三个参数，本来的subscribe的唯一函数参数成为了第三个参；
function observeStore(store, select, onChange) {
    let currentState;  //闭包保存上一次的state

    function handleChange() { //又一个闭包
        let nextState = select(store.getState()); //用传入的select筛选需要的state对象的某个值
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}
//我们可以这样调用
function select(state) {
    return {
        liangwei:state.liangwei
    }
};//定义一个选择函数
var listner2=observeStore(store,select,function (state) {
   console.log("listner2",state)
});

//利用store的dispatch方法派发一个action
let action2={
    type:"CHANGE_LIANGWEI_NAME",
    names:"梁炜"
};
store.dispatch(action2);







