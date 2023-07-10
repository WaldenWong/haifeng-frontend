export default{
    namespaced: true,
    state:{
        name:'员工',
    },
    mutations:{
        // 普通方法
        getName(state){
            console.log(state.name)
        }
    },
    actions:{
        // 异步方法
    }
}