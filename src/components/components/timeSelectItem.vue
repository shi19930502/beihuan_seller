<template>
	<div>
		<el-time-select
		    placeholder="起始时间"
		    :value="startTime"
		    @input="changeStart"
		    @change="startChange"
		    value-format="hh:mm:ss"
		    :picker-options="{
		      start: start,
		      step: step,
		      end: end,
		      maxTime: endTime
		    }">
	  	</el-time-select>
	  	<el-time-select
		    placeholder="结束时间"
		    :value="endTime"
		    @input="changeEnd"
		    @change="endChange"
		    value-format="hh:mm:ss"
		    :picker-options="{
		      start: start,
		      step: step,
		      end: end,
		      minTime: startTime
		    }">
	  	</el-time-select>
	</div>	
</template>
<script>
import configs from '../../configs.js'
	export default {
		name: 'timeSelectItem',
		data() {
			return {

			}
		},
		props: {
			start: {
				default: ''
			},
			step: {
				default: '01:00'
			},
			end: {
				default: ''
			},
			startTime: {
				default: ''
			},
			endTime: {
				default: ''
			}
		},
		methods: {
			changeStart(value) {
				this.$emit('update:startTime', $.trim(value))
			},
			changeEnd(value) {
				this.$emit('update:endTime', $.trim(value))
			},
			startChange(value) {
				this.$emit('startChange', $.trim(value))
			},
			endChange(value) {
				this.$emit('endChange', $.trim(value))
			}
		}
	}
</script>