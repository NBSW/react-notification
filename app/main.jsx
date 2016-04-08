var React = require('react');
var ReactDOM = require('react-dom');
var Notification = require('./notification.jsx');
document.addEventListener('click', function(e) {
	var a = Math.random()
	console.log(1)
	Notification.render({
		message: a + 100,
		type: 'success'
	});
})
console.log(Notification)
Notification.render({
	message: 'success',
	type: 'success'
});
setTimeout(function() {
	Notification.render({
		message: 'error',
		type: 'error'
	});
}, 1000);
setTimeout(function() {
	Notification.render({
		message: 'warning',
		type: 'warning'
	});
}, 5000);