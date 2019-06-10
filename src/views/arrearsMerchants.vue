<template>
<div class="orders_received">
  <div class="toubu_A">
    <span class="tliel_name">
      <searchInputItems>
        <searchInputItem name="日期范围">
          <dateEditorDaterange :dateValue.sync="dateValue" :dateRange='dateRange'></dateEditorDaterange>
        </searchInputItem>
      </searchInputItems>
    </span>
    <span class="addanniu">
      <iconBtn iconClass="el-icon-search" content="查询" @click="getArrearsMerchants" type="primary">查询</iconBtn>
      <iconBtn iconClass="el-icon-refresh" content="重置" @click="reset">重置</iconBtn>
    </span>
  </div>
  <!-- 图表 -->
  <div class="flex-x-start flex-wrap" v-loading="pieLoading">
    <div id="CWarnDiv" style="height: 400px;width: 1650px;"></div>
  </div>
</div>
</template>

<script>
import local from '../local.js'
import mixin from '../mixin/mixin.js' //公共方法，包括主要的ajax
export default {
  mixins: [mixin],
  data() {
    return {
			buyerName:[],
			orderPaid:[],
			orderUnpaid:[],
      searchForm: {},
    }
  },
  mounted() {
    this.getArrearsMerchants();
  },
  methods: {
    searchTable() {
			if(this.dateValue.length == 0) {
				this.dateValue = [this.getBeforeDay_7, this.getToday];
			}
			var param = Object.assign({}, this.searchForm, {
				startTime: this.dateValue[0],
				endTime: this.dateValue[1],
			})
			console.log(param);
    },
    reset() {
      this.dateValue=[];
      this.getArrearsMerchants();
    },
    getArrearsMerchants() {
			this.initWarning();
			this.buyerName=[];
			this.orderPaid=[];
			this.orderUnpaid=[];
			var param={};
			if(this.dateValue.length != 0) {
				param={
				startTime: this.dateValue[0],
				endTime: this.dateValue[1],
				sellerId: local.get('sessionUser').typeCode==null?'':local.get('sessionUser').typeCode}
			}else{
				param={sellerId: local.get('sessionUser').typeCode==null?'':local.get('sessionUser').typeCode}
			}
      this._ajax({
        url: this.rootAPI,
        name: "orderselloncredit/getArrearsMerchantsList",
        param: param,
        loading: "dataLoading"
      }).then(function(d) {
        d.aaData.forEach(data => {
          if (data.buyerName) {
            //正式物料信息
            this.buyerName.push(data.buyerName);
            this.orderPaid.push(data.orderPaid);
            this.orderUnpaid.push(data.orderUnpaid);
          }
        });
				this.initWarning();
      }.bind(this));

    },
    initWarning() {
      this.CWarnChars = echarts.init(document.getElementById("CWarnDiv"));
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['已付款金额[元]', '未付款金额[元]']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['line', 'bar']
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
				dataZoom: [
						{
								show: true,
								start: 0,
								end: 100
						},
						{
								type: 'inside',
								start: 0,
								end: 100
						},
						{
								show: true,
								yAxisIndex: 0,
								filterMode: 'empty',
								width: 30,
								height: '80%',
								showDataShadow: false,
								left: '93%'
						}
				],
        calculable: true,
        xAxis: [{
          type: 'category',
          data:this.buyerName,
					axisPointer: {
							type: 'shadow'
					},
					axisLabel: {
						interval:0,
						fontSize:10,
						rotate:40,
						showMaxLabel:true
					},
        }],
        yAxis: [
					{
	            type: 'value',
	            name: '金额[元]',
	            axisLabel: {
	                formatter: '{value} '
	            }
	        },
			],
        series: [{
            name: '已付款金额[元]',
            type: 'bar',
            data: this.orderPaid,
						itemStyle: {
								normal: {
										label: {
											show: true, //开启显示
											// position: 'top', //在上方显示
										}
								}
						}
          },
          {
            name: '未付款金额[元]',
            type: 'bar',
            data: this.orderUnpaid,
						itemStyle: {
								normal: {
										label: {
											show: true, //开启显示
											// position: 'top', //在上方显示
										}
								}
						}
          }
        ]
      };
      this.CWarnChars.setOption(option);
    },
  },
}
</script>
<style lang="sass">
	.orders_received {
		.toubu_A {
			height: 80px;
			padding: 10px;
			.tliel_name {
				float: left
			}
			.addanniu {
				float: right;
			}
		}
	}
</style>
