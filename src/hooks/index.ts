// useState
/**
 * 定义函数组件的状态
 * 要遵循状态最小化原则 --  这个状态是必须的吗？可以通过计算得到吗？
 * 避免中间状态，确保唯一数据源。
 * 
 */

// useEffect
/**
 * useEffect 接收的返回值是一个回调函数，
 * 这个回调函数不只是会在组件销毁时执行，而且是每次 Effect 重新执行之前都会执行，用于清理上一次 Effect 的执行结果。
 * 理解这一点非常重要。useEffect 中返回的回调函数，只是清理当前执行的 Effect 本身。
 * 
 */

// useCallback!
/*
function Counter() {
const [count, setCount] = useState(0);
const handleIncrement = () => setCount(count + 1);
// ...
return <button onClick={handleIncrement}>+</button>
}

每次组件状态发生变化时，函数组件实际上都会重新执行一遍。
每次执行的时候，如果组件内函数都会重新创建一次。
虽然不影响结果的正确性，但是这么做增加了系统的开销，更重要的是。每次创建新函数的方式，会让接受函数的组件 重新渲染。
*/

// useMemo
/**
 * 用来缓存计算数据。
 * useCallback = (fn, deps) => useMemo(() => fn, deps)
 */

// useRef 在多次渲染之间共享数据
/**
 * 可以把 useRef 理解为函数之外创建的容器空间。多用于保存和渲染无关的数据。ref变更时，并不会引起重新渲染。
 * 保存DOM节点的引用，是ref的第二个重要的功能
 */

// useContext
/**
 * context 提供了一个全局状态管理的能力。
 * 很多状态管理框架，比如 Redux，
 * 正是利用了 Context 的机制来提供一种更加可控的组件之间的状态管理机制。
 * 因此，理解 Context 的机制，也可以让我们更好地去理解 Redux 这样的框架实现的原理。
 * 
 */

// 设计模式
/**
 * 容器模式 把按需执行的Hooks拆分成子组件，然后通过一个容器组件来进行实际的条件判断。
 *   也可以把条件判断写入到Hooks内部，可以无条件使用Hooks。
 * 
 */