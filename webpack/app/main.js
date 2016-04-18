var Notification = require('../component/notification.jsx');

document.getElementById('success').addEventListener('click', function(e) {
	Notification.render({
		type: 'success',
		message: '这是一条成功的信息',
		duration: 1000,
	});
});

document.getElementById('warning').addEventListener('click', function(e) {
	Notification.render({
		type: 'warning',
		message: '这是一条警告的信息',
		duration: 3000
	});
});

document.getElementById('error').addEventListener('click', function(e) {
	Notification.render({
		type: 'error',
		message: '这是一条错误的信息',
		duration: 5000
	});
});

document.getElementById('queue').addEventListener('click', function(e) {
	Notification.render({
		type: 'success',
		message: '这是三条队列模式下的信息',
		queue: true,
		duration: 1000
	});
	Notification.render({
		type: 'warning',
		message: '这是三条队列模式下的信息',
		queue: true,
		duration: 2000
	});
	Notification.render({
		type: 'error',
		message: '这是三条队列模式下的信息',
		queue: true,
		duration: 3000
	});
});
Notification.extend({
	type: 'black',
	color: '#000'
});

setTimeout(function() {
	Notification.render({
		type: 'success',
		message: 'success'
	});
});

setTimeout(function() {
	Notification.render({
		type: 'warning',
		message: 'warning'
	});
},1000);

setTimeout(function() {
	Notification.render({
		type: 'error',
		message: 'error'
	});
},3000);

setTimeout(function() {
	Notification.render({
		type: 'black',
		message: 'black'
	});
}, 4000);

