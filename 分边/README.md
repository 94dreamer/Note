```
function fun(arr){
	if(typeof arr==='string'){
		arr=arr.split(",");
	}
	const arr1=[];
	const arr2=[];
	for(var i=0;i<arr.length;i++){
		if(Math.random()*1<0.5){
			arr1.length<5?arr1.push(arr[i]):arr2.push(arr[i])
		}else{
			arr2.length<5?arr2.push(arr[i]):arr1.push(arr[i])
		}
	}
	console.log(arr1)
	console.log(arr2)
}
fun(['深圳湾','广渠门外','小平湖','还想再爱你一次','仕兰','沙湾','梅溪湖','青葡萄','金兰','呼伦贝尔'])
```

```
Array.prototype.shuffle = function() {
	var input = this;
	for (var i = input.length-1; i >=0; i--) {
		var randomIndex = Math.floor(Math.random()*(i+1));

		input[i]=input[i]+'✨✨✨✨✨✨✨✨✨✨'.slice(input[i].length)
		input[randomIndex]=input[randomIndex]+'✨✨✨✨✨✨✨✨✨✨'.slice(input[randomIndex].length)

		var itemAtIndex = input[randomIndex]; 
		input[randomIndex] = input[i]; 
		input[i] = itemAtIndex;
	}
	return '左边：'+input.slice(0,input.length/2).toString()+'\n右边：'+input.slice(input.length/2).toString();
}
var tempString = '深圳湾,广渠门外,小平湖,倒马桶,仕兰,沙湾,梅溪湖,青葡萄,金兰,呼伦贝尔';
console.log(tempString.split(",").shuffle()); 
```