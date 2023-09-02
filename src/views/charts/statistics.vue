<template>
  <!-- 组件主盒子 -->
  <div class="stbox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据可视化</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 统计图 -->
    <div>
      <el-row :gutter="23">
        <el-col :span="12" class="text-c">
          <div class="paybox">
            <div class="cavasbox" ref="payEchart"></div>
          </div>
        </el-col>
        <el-col :span="12" class="text-c">
          <div class="paybox">
            <div class="cavasbox" ref="payNumEchart"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Chart from 'echarts'


export default {
  name: "welcome",
  data() {
    return {
      revenueByMonth : [1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      monthlyOrderCount:[],
      orderData: [],
      monthlyRevenue :[],
      machineNo: '',
      paymentTypeRate :'',
      type: 'day',
      //  支付方式统计
      payoption: {
        backgroundColor: '#2c343c',
        title: {
          text: '订单状态比例',
          left: 10,
          top: 5,
          textStyle: {
            fontSize: 12,
            color: '#ccc'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: '订单状态比例',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [

            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      },
      payNumoption: {
        backgroundColor: '#2c343c',
        title: {
          text: '订单支付方式比例',
          left: 10,
          top: 5,
          textStyle: {
            fontSize: 12,
            color: '#ccc'
          }
        },

        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: '支付方式统计(笔数)',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [

            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]

      },
    }
  },
  // 导入组件
  components: {
    // 点聚合组件
  },
  // 创建完毕状态(里面是操作)
  created() {
  },
  // 挂载结束状态(里面是操作)
  mounted() {
    this.payRateNum()
    this.orderStatusRate()
  },
  // 里面的函数只有调用才会执行
  methods: {
    orderStatusRate(){
      this.$axios.get('/order/orderStatusRate').then(res => {
        if (res.data.code === 200) {
          this.payoption.series[0].data=res.data.data
          this.getpay()
        } else {
          this.$message.warning(res.data.data)
        }
      })
    },
    payRateNum(){
      this.$axios.get('/order/getPayMethodRate').then(res => {
        this.paymentTypeRate = res.data.data
        this.payNumoption.series[0].data = this.paymentTypeRate
        this.getpayNum()
      })
    },
    // 支付方式统计
    getpay() {
      this.chart = Chart.init(this.$refs.payEchart)
      this.chart.setOption(this.payoption)
    },
    // 支付方式统计
    getpayNum() {
      this.chart = Chart.init(this.$refs.payNumEchart)
      this.chart.setOption(this.payNumoption)
    }
  }
};
</script>
<style>
.stbox {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.text-c {
  text-align: center;
}

.st-gbox {
  background-color: #fff;
  margin-top: 20px;
  border-radius: 5px;
  height: 30vh;
  box-sizing: border-box;
  padding: 10px;
}

.cavasbox {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.paybox {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 5px;
  margin-top: 20px;
  height: 32vh;
}
</style>
