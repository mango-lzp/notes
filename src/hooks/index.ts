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


////   home work 自己实现一个 useState 和 useEffect
// 当前的fiber
const currentlyRenderingFiber = {
  memoizedState: null
}
// 当前执行的hook
let workInProgressHook: Hook = null
let componentUpdateQueue = null

const mountWorkInProgressHook = () => {
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  }

  if (workInProgressHook === null) {
    // 当初始化第一个 hook 节点的时候
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // 不是第一个节点，直接放到后面
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}

function dispatchAction (fiber, queue, action) {
  if(typeof newValue === 'function') {
    workInProgressHook.memoizedState = newValue()
  } else {
    workInProgressHook.memoizedState = newValue
  }

  commitHookEffectList(UnmountPassive, NoHookEffect)
  commitHookEffectList(NoHookEffect, MountPassive)
}

export const mountUseState = (initialState: any) => {
  const hook = mountWorkInProgressHook()

  if(typeof initialState === 'function') {
    initialState = initialState()
  }
  hook.memoizedState = hook.baseState = initialState

  // 初始化当前 hook 对象的更新队列
  // 后面的更新阶段操作会往里面放值
  const queue = hook.queue = { 
    pending: null,
    interleaved: null,
    // lanes: NoLanes,
    dispatch: null,
    // lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  const dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
  return [hook.memoizedState, dispatch]
}

function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    // Circular
    next: null as any
  }
  //如果 FunctionComponent 的更新队列不存在的话，则初始化它
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    componentUpdateQueue.lastEffect = effect.next = effect;
  }
  //否则将此 effect 添加至更新队列末尾
  else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null,
  };
}

export const MountPassive = 0b01000000; //64
export const UnmountPassive = 0b10000000; //128
export const useEffect = (create: () => void, deps: Array<any>) => {
  // mountEffect useEffect 第一次执行实际上就是挂载effect
  const hook = mountWorkInProgressHook()
  //初始化 deps 参数
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = pushEffect(MountPassive | UnmountPassive, create, undefined, nextDeps)
}

const updateEffect = (create: () => void, deps: Array<any>) => {
  // 更新阶段时调用的effect
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}

export function updateEffectImpl(fiberFlags, hookFlags, create, deps): void {
  // 当前正在更新的 fiber 节点上的 hook
  const hook = updateWorkInProgressHook();
  // 新的 deps
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  //currentHook: 当前 fiber 节点上的 hook 对象

  // 当前 fiber 节点上存在 hook 对象
  if (currentHook !== null) {
    // 获取旧的 effect 状态
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    // 如果新的 deps 存在
    if (nextDeps !== null) {
      // 获取旧的 deps
      const prevDeps = prevEffect.deps;
      // 比较新旧 deps 是否相同
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 新旧 deps 相同，传入 hookFlags， 表示不需要 update，更新 hook 对象上的 effect 链
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  // 代码执行到这里，表示新旧的 deps 不一样
  // 更新 当前 fiber 节点上的 flags 标识，区分当前 effect 是 useEffect 还是 useLayoutEffect
  currentlyRenderingFiber.flags |= fiberFlags;

  // 传入 HookHasEffect | hookFlags 位运算的结果，更新 hook 对象上的effect 链
  hook.memoizedState = pushEffect(
    // HookHasEffect 和 hookFlags 做位运算
    // HookHasEffect 标记Effect的回调和销毁函数需要执行
    // hookFlags 参数值为 HookPassive，表示 hook 是 useEffect
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps,
  );
}

export function updateWorkInProgressHook(): Hook {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base. When we reach the end of the base list, we must switch to
  // the dispatcher used for mounts.

  // 获取 当前 hook 的下一个 hook
  let nextCurrentHook: null | Hook;
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  // 取下一个 hook 为当前的hook
  let nextWorkInProgressHook: null | Hook;
  if (workInProgressHook === null) {
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;

    currentHook = nextCurrentHook;
  } else {
    // Clone from the current hook.

    // 拷贝当前的 hook，作为当前正在工作中的 workInProgressHook

    console.error(
      nextCurrentHook !== null,
      'Rendered more hooks than during the previous render.',
    );
    currentHook = nextCurrentHook;

    const newHook: Hook = {
      memoizedState: currentHook.memoizedState,

      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,

      next: null,
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}

function areHookInputsEqual(
  nextDeps: Array<any>,
  prevDeps: Array<any> | null,
) {
    
  // 删除了 dev 代码
    
  if (prevDeps === null) {
    
    // 删除了 dev 代码
    
    return false;
  }

  // 删除了 dev 代码
    
  // deps 是一个 Array，循环遍历去比较 array 中的每个 item
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    // is比较函数是浅比较
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}


interface Hook {
  memoizedState: null | any,
  baseState: null | any,
  baseQueue: null | any,
  queue: null | any,
  next: null | Hook
}