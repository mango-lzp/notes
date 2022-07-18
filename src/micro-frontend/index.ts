// 实现子应用的注册、挂载、切换、卸载

/**
 * 子应用状态
 */
// 子应用注册的初始状态
const NOT_LOADED = 'NOT_LOADED'
// 表示正在加载子应用代码
const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'
// 执行完app.loadApp，表示子应用加载完成的状态，还未进行bootstrap
const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'
// 正在初始化
const BOOTSTRAPPING = 'BOOTSTRAPPING'
// 初始化完成，未挂载
const NOT_MOUNTED = 'NOT_MOUNTED'
// 正在挂载
const MOUNTING = 'MOUNTING'
// 挂载完成，app.mount 执行完成
const MOUNTED = 'MOUNTED'
// 
const UPDATING = 'UPDATING'
// 正在卸载
const UNMOUNTING = 'UNMOUNTING'

// single-spa 还有三种状态，未涉及。
const UNLOADING = 'UNLOADING'
const LOAD_ERROR = 'LOAD_ERROR'
const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'

// 子应用列表
const apps: Application[] = []

// 注册子应用
export function registerApplication (appConfig) {
  apps.push(Object.assign({}, appConfig, { status: NOT_LOADED }))
  reroute()
}

let isStarted = false
export function start () {
  isStarted = true
}

function reroute () {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges()

  // 卸载已加载的子应用，加载当前应用。
  function performAppChanges () {
    appsToUnmount.map(toUnmount)
    appsToMount.map(tryToBootstrapAndMount)
  }

  function loadApps () {
    appsToLoad.map(toLoad)
  }
  
  if(isStarted) {
    performAppChanges()
  } else {
    loadApps()
  }
}

function getAppChanges () {
  const appsToLoad = [],
    appsToMount = [],
    appsToUnmount = []

  apps.map(app => {
    switch(app.status) {
      case NOT_LOADED:
        appsToLoad.push(app)
        break;
      // 初始化和挂载
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        appsToMount.push(app)
        break;
      case MOUNTED:
        appsToUnmount.push(app)
        break;
    }
  })

  return { appsToLoad, appsToMount, appsToUnmount }
}

async function toUnmount(app: Application) {
  if(app.status !== MOUNTED) return app

  app.status = UNMOUNTING
  await app.unmount(app.customProps)
  app.status = MOUNTED
  return app
}

async function tryToBootstrapAndMount (app: Application) {
  if(shouldBeActive(app)) {
    app.status = BOOTSTRAPPING
    await app.bootstrap(app.customProps)
    app.status = NOT_MOUNTED

    // 第二次判断是为了防止中途用户切换路由。
    if(shouldBeActive(app)) {
      app.status = MOUNTING
      await app.mount(app.customProps)
      app.status = MOUNTED
    }
  }
}

function shouldBeActive (app: Application) {
  try {
    return app.activeWhen(window.location)
  } catch (e) {
    console.error('app.activeWhen function error', e)
    return false
  }
}

async function toLoad (app: Application) {
  if(app.status !== NOT_LOADED) return app

  app.status = LOADING_SOURCE_CODE
  const res = await app.app()
  app.status = NOT_BOOTSTRAPPED

  // 将子应用导出的生命周期函数挂载到 app 对象上
  app.bootstrap = res.bootstrap
  app.mount = res.mount
  app.unmount = res.bootstrap
  app.unload = res.unload

  reroute()
  return app
}

// @ts-ignore
// 让子应用判断自己是否运行在微前端环境中。
window.singleSpaNavigate = true
// 监听路由变化，如果路由发生了变化，就执行 reroute
window.addEventListener('hashchange', reroute)
window.history.pushState = patchedUpdateState(window.history.pushState)
window.history.replaceState = patchedUpdateState(window.history.replaceState)

function patchedUpdateState (updateState: History['pushState']) {
  return function (...args) {
    const urlBefore = window.location.href
    const result = Reflect.apply(updateState, this, args)
    const urlAfter = window.location.href
    if(urlBefore !== urlAfter) {
      reroute()
    }
    return result
  }
}


interface Application {
  status: string
  app: Function
  mount: Function
  bootstrap: Function
  unmount: Function
  unload: Function
  activeWhen: (location: typeof window.location) => boolean

  customProps: any
}