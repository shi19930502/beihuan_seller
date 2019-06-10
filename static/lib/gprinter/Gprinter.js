	var cessss='123'
	class Gprinter{
		constructor(item){
			console.log(item)
			this.item=item
			
		}
		static sayName(){
	            console.log("hehesayName");
	            return "he2he2say2Name";
	      }
		cesf_1(){
			console.log('cesf_1')
		}
	}
	class GprinterChildren extends  Gprinter{
		constructor(item){
			super();
			this.item=item;
		}
		ces1(){
			console.log('ces1')
			super.cesf_1();
		}
		ces2(){
			console.log('ces2')
			super.cesf_1();
			return 1232132
		}
		static sayName(){
//				super.sayName();
	            return "he2he2say2Name";
	      }
	}
	
var ces = new GprinterChildren({a:3,b:4})
ces.ces1()
export {cessss,GprinterChildren}
