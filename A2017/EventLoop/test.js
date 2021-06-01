// var start=new Date();
//
// setTimeout(function () {
//   var end= new Date();
//   console.log('Time elapsed1:',end-start,'ms');
//   while (new Date()-end<1000){};
// },500);
//
// setTimeout(function () {
//   var end= new Date();
//   console.log('Time elapsed2:',end-start,'ms');
// },500);
//
// while (new Date()-start<1000){};

// var obj = {};
// console.log(obj);
// obj.foo = 'bar';

var fireCount = 0;
var start = new Date;
var timer = setInterval(function() {
  if (new Date-start > 1000) { clearInterval(timer); console.log(fireCount); return;
  }
  fireCount++;
}, 0);