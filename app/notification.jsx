var React = require('react');
var ReactDOM = require('react-dom');
var timers = {}; //record timers' id;

//reset body css
document.body.style.cssText += 'margin: 0'; 
var notificationStyle = {
  position: 'absolute',
  width: '100%',
  textAlign: 'center',
  fontSize: '13px',
  color: '#fff',
  bottom: '-30px',
  opacity: 0,
  overflow: 'hidden',
};

var notificationApi = {
  messageQueue: [],

  // enter component api
  render: function(props) {
    var _this = this, message, type;
    this.messageQueue.push(props);
    message = this.messageQueue.pop().message;
    type = this.messageQueue.pop().type;
    if(document.getElementById('Notification')) {
      clearTimeout(timers.waiting);
      clearInterval(timers.end);
      this.removeDeadComponent(function(){
        ReactDOM.render(
          <Notification type={type} message={message} />, 
          document.getElementById('NotificationContent')
        );
      });
    } else {
      ReactDOM.render(
        <Notification type={type} message={message} />, 
        document.getElementById('NotificationContent')
      );
    }
  },

  createContentDiv: function() {
    // we must create a element node for our content
    if(!document.getElementById('NotificationContent')) {
      this.content = document.createElement('DIV');
      this.content.id = "NotificationContent";
      this.content.style.cssText += "position: absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;";
      document.body.appendChild(this.content);
    }
  },

  // clear the dom when it is over
  removeDeadComponent: function(){
    clearTimeout(timers.waiting); // clear the waiting timer
    var notification = document.getElementById('Notification');
    var opacity = 1;
    var bottom = 0;
    timers.end = setInterval(function(){
      opacity.toFixed(1) == '0.0'? opacity = 0 : opacity -= 0.05;
      bottom -= 1.5;
      if(bottom == -30) {
        clearInterval(timers.end);
        ReactDOM.unmountComponentAtNode(notificationApi.content);
        return;
      }
      notification.style.opacity = opacity;
      notification.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + opacity * 100 + ")";
      notification.style.bottom = bottom +'px';
    }, 16.7);
  },

}

//
var Notification = React.createClass({

  getInitialState: function(){
    var style = {
      height: '25px',
      lineHeight: '25px',
    }
    switch (this.props.type) {
      case 'success':
        {
          style.backgroundColor = '#51b110';
          break;
        }
      case 'error':
        {
          style.backgroundColor = '#f82929';
          break;
        }
      case 'warning':
        {
          style.backgroundColor = '#ef8808';
          break;
        }
      default:
        {
          style.backgroundColor = '#51b110';
          break;
        }
    }
    return {
      messageStyle: style
    }
  },

  render: function(){
    return (
      <div id="Notification" style={notificationStyle}>
        <div style={this.state.messageStyle} ref="div">{this.props.message}</div>
      </div>
    )
  },

  componentDidMount: function() {
    var _this = this;
    var notification = ReactDOM.findDOMNode(this);
    var opacity = 0;
    var bottom = -30;
    timers.start = setInterval(function() {
      opacity.toFixed(1) == '1'? opacity = 1 : opacity += 0.05;
      bottom += 1.5;
      if(opacity.toFixed(1) == 1) {
        clearInterval(timers.start);
        timers.waiting = setTimeout(function(){
          notificationApi.removeDeadComponent();
        },2000);
      }
      notification.style.opacity = opacity;
      notification.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + opacity * 100 + ")"; 
      notification.style.bottom = bottom +'px';
    }, 16.7);
  },

});

notificationApi.createContentDiv();

module.exports = notificationApi;