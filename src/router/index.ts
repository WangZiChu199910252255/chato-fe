import useChannel from '@/composables/useChannel'
import usePageTitle from '@/composables/usePageTitle'
import useRoleCheck from '@/composables/useRoleCheck'
import useSidebar from '@/composables/useSidebar'
import { useAuthStore } from '@/stores/auth'
import Sensors from '@/utils/sensors'
import { locationComToCn } from '@/utils/url'
import { nextTick } from 'vue'
import { RouterView, createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const RoutesMap = {
  aiPlugin: {
    center: 'aipluginCenter',
    detail: 'aipluginDetail'
  },
  home: {
    homeName: 'home',
    index: 'homeIndex',
    nash: 'homeNash',
    case: 'homeCase',
    homeResource: 'homeResource',
    homeChat: 'homeChat'
  },
  auth: {
    authName: 'auth',
    login: 'authLogin',
    loginInvite: 'authLoginInvite',
    logout: 'authLogout',
    verify: 'authVerify'
  },
  safe: 'safe',
  release: 'release',
  chat: {
    chatName: 'chat',
    release: 'chatRelease',
    c: 'chatC',
    homeC: 'chatHomeC',
    resource: 'resource',
    navigator: 'navigator'
  },
  resource: 'resource',
  tranning: {
    bot: 'tranningBot',
    roleInfo: 'tranningRoleInfo',
    knowledge: 'tranningKnowledge',
    knowledgeGenerate: 'tranningKnowledgeGenerate',
    release: 'tranningRelease',
    report: 'tranningReport',
    reportContext: 'tranningReportContext',
    botChat: 'tranningBotChat'
  },
  manager: {
    managerName: 'manager',
    center: 'managerCenter',
    create: 'managerCreate',
    createByDoc: 'managerCreateByDoc'
  },
  namespace: {
    namespaceName: 'namespace',
    personalSetting: 'namespacePersonalSetting',
    management: 'namespacePersonalManagement',
    summary: 'namespaceSummary',
    income: 'namespaceIncome'
  },
  vip: {
    center: 'vipCenter'
  },
  inviteMember: 'inviteMember',
  guide: {
    first: 'guideFirst'
  },
  namespaceSwitch: 'namespaceSwitch',
  endPlatform: {
    adCollectForm: 'endPlatformadCollectForm'
  }
}

const coreRoutes = [
  {
    path: '/error',
    component: RouterView,
    children: [
      {
        path: '403',
        component: () => import('@/views/error/Error403.vue')
        // meta: { title: '错误 403' }
      },
      {
        path: '404',
        component: () => import('@/views/error/Error404.vue')
        // meta: { title: '错误 404' }
      },
      {
        path: '500',
        component: () => import('@/views/error/Error500.vue')
        // meta: { title: '错误 500' }
      }
    ]
  }
]
const chatRoutes = [
  {
    path: 'c',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      title: '对话',
      requiresAuth: true
    },
    children: [
      {
        name: RoutesMap.chat.navigator,
        path: 'bot/chato_navigator',
        component: () => import('@/components/Chat/ChatoNavigator.vue')
      },
      {
        name: RoutesMap.home.homeResource,
        path: 'bot/square',
        component: () => import('@/views/resource/square.vue')
      },
      {
        name: RoutesMap.chat.c,
        path: 'bot/:botSlug',
        // meta: { title: '聊天' },
        component: () => import('@/views/chating/ChatItem.vue')
      }
    ]
  }
]

const loginedRoutes = [
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [...coreRoutes, ...chatRoutes]
  }
]

const finalRoutes = [
  {
    path: '/:any+',
    redirect: '/error/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...loginedRoutes, ...finalRoutes] as RouteRecordRaw[]
})

router.beforeEach((to) => {
  const { drawerVisible } = useSidebar()
  const { shareChannel } = useChannel()
  const sensors = new Sensors()
  const { saInstance } = sensors
  drawerVisible.value = false

  locationComToCn()
  useRoleCheck(to)
  usePageTitle(to.meta?.title)
  saInstance?.track('channel-source', {
    name: 'channel来源',
    type: 'channel-source',
    data: shareChannel
  })
  // useCheckDomain(to)
  const authStoreI = useAuthStore()
  if (to.meta.requiresAuth && !authStoreI.authToken) {
    let query
    // 通过 redirect 参数保存当前所在的位置，以便登录后返回
    // 如果当前是首页，就不用存了，因为登录后默认回首页
    if (to.fullPath !== '/') query = { redirect: to.fullPath }
    return {
      path: '/auth/login',
      query
    }
  }
})

router.afterEach((to) => {
  nextTick(() => {
    const sensors = new Sensors()
    const { saInstance } = sensors
    saInstance?.quick('autoTrackSinglePage')
  })
})

// 由于当前部署，采用镜像构建并覆盖全部新文件，解决网站有老用户停留在老页面，但旧资源地址在服务器已被移除掉的问题
// 期待 Vite 的解决方案：https://github.com/vitejs/vite/issues/11804
router.onError((error, to) => {
  if (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Importing a module script failed')
  ) {
    if (!to?.fullPath) {
      window.location.reload()
    } else {
      window.location.href = to.fullPath
    }
  }
})

export default router
