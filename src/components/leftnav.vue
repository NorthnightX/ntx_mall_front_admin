
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path"
           unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff"
           active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{ menu.menuname }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{ chmenu.menuname }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: [],
      filteredMenu: [],
      user:[],
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: 'icon-renyuanguanli',
          menuname: '博客管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-yuangonggonghao',
              menuname: '博客内容管理',
              hasThird: 'N',
              url: 'blog/blog',
              menus: null
            }, {
              menuid: 3,
              icon: 'icon-dailishang',
              menuname: '博客分类管理',
              hasThird: 'N',
              url: 'blog/blogType',
              menus: null
            }
            ]
        },
        {
          menuid: 150,
          icon: 'icon-tongji1',
          menuname: '统计',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 159,
              icon: 'icon-tongji',
              menuname: '数据可视化',
              hasThird: 'N',
              url: 'charts/statistics',
              menus: null
            }
          ]
        }
      ],
      msg: 'success'
    }
    this.allmenu = res.data
    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  },
  methods: {

  }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}

.logoimg {
  height: 40px;
}
</style>
