
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
          icon: 'icon-renyuan',
          menuname: '人员管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-ic_person_card24px',
              menuname: '用户管理',
              hasThird: 'N',
              url: 'user/user',
              menus: null
            }
            ]
        },
        {
          menuid: 1,
          icon: 'icon-31quanbushangpin',
          menuname: '商品管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-shangpin',
              menuname: '商品管理',
              hasThird: 'N',
              url: 'product/product',
              menus: null
            },
            {
              menuid: 2,
              icon: 'icon-leibie',
              menuname: '商品类别管理',
              hasThird: 'N',
              url: 'product/category',
              menus: null
            },
            {
              menuid: 2,
              icon: 'icon-guanggaowei',
              menuname: '广告管理',
              hasThird: 'N',
              url: 'product/advertise',
              menus: null
            }
          ]
        },
        {
          menuid: 1,
          icon: 'icon-dingdan',
          menuname: '订单管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-dingdan1',
              menuname: '订单管理',
              hasThird: 'N',
              url: 'order/order',
              menus: null
            },
          ]
        },
        {
          menuid: 150,
          icon: 'icon-tongjifenxi-changguitongji',
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
