# react-optimistic-component

启动演示：

```
yarn install
npm start
```

展示在react组件中集成积极UI（Optimistic UI）的效果。

我们的目标是：

1. 有个透明的基类，你可以让所有的组件继承这个基类，但如果不使用积极UI，那么所有的代码都不需要变更。
2. 合理的规范，在一定规范下可以无缝地使用或移除积极UI的效果。
3. 简洁的API，积极UI是在正常视图更新之上的补丁，而不需要复杂的状态管理，也不需要感知积极UI是如何工作的。

为了使用积极UI，你的组件需要符合以下规范：

- 组件继承自`OptimisticComponent`，单纯地修改继承关系不会给你带来任何副作用。
- 所有的`setState`调用的第一个参数必须为函数，而不是一个对象，这对你编写组件有一定的约束性，你可以参考在Redux中是如何编写reducer的。

当你需要使用积极UI时，按以下操作进行：

1. 生成一个事务ID，这个ID可以是任意的具备唯一性的对象，最简的方法是使用一个空的新对象（`{}`）。
2. 调用`setState`时（再次提醒，只能使用函数作为第一个参数），将事务ID作为第3个参数传递。
3. 当需要将一个事务内的积极UI效果移除时，调用`this.rollbackOptimistic(transactionId)`方法，将事务ID作为参数传过去。

具体代码请看[App.js](src/App.js)中的`submitNewItem`方法的实现。

## 与Redux结合

我们已经开发了[redux-optimistic-manager](https://github.com/ecomfe/redux-optimistic-manager)作为Redux的基础功能，配套有[redux-optimistic-thunk](https://github.com/ecomfe/redux-optimistic-thunk)作为支持，进一步有[redux-managed-thunk](https://github.com/ecomfe/redux-managed-thunk)（开发中）提供更完善的功能。
