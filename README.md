# vue-Music 快应用

原为[某课网项目](https://coding.imooc.com/class/107.html)，借此用于熟悉 Vue 技术体系，在此感谢 **<u>ustbhuangyi</u>** 老师!!



## 安装依赖

```npm
npm install
```





## 启动项目

```npm
npm start
```





## 效果展示

效果就不展示了，[这里](http://coding.imooc.com/class/107.html)有；





## 项目感悟

起初根据教程，使用 Vuex 实现跨组件通讯，后因觉得业务逻辑过于集中在 Action ，略显臃肿，且因迷恋 Angular 的 Rxjs 状态管理形式，遂尝试使用 Vue-rx (Vue 版的 Rxjs) 替换 Vuex 的状态管理机制，并实现了类似 mapGetters 的 mapObservers 统一接口，但最后还是发现 Vuex 较好……真香；

- 因为 Vue-rx 源码内部，其实还是通过 defIneReactive 处理传入数据，意即还是通过 Object.defineProperty 实现双绑，而其中的 Rxjs 只是作为一种事件通知的方式(对数据刷新起真正作用的不是它，只作为辅助)；Vue-rx 将其暴露，所以才可使用 Observer 的流式处理风格；
- 虽然 Vuex 的形式，会让状态管理逻辑集中在 Action，长期以往会显得代码比较臃肿、难以调试；但如果强行使用 Observer，除了需要自定义和维护一份 state，还要处理多个数据 subscribe 的问题，反而更显复杂化，如果数据不是简单的一对一关系，则会更加容易出错；
- 所以不能强行使用，Rxjs 之所以能在 Angular 使用如此顺滑，是因为其与 Ng 的 Zone 紧密结合：Rxjs 事件变化会触发变更检测，进而触发数据更新；所以因个人原因而强行使用这种行为是愚蠢的；正如世事无绝对，每种技术的诞生，都有其存在的意义与适用的场景，不能因为"我觉得它好使就乱用"，这种为了用而用的行为需要我去深思与反省；

