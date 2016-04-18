(function (global, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.Notification = factory();
  }
}(typeof window !== "undefined" ? window : this, function () {

  window.timers = {}; //record timers' id, they are 'start', 'waiting', 'end' and 'queue';

  // reset body css
  document.body.style.cssText += 'margin: 0'; 

  var notificationStyle = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: '13px',
    color: '#fff',
    height: '30px',
    bottom: '-30px',
    opacity: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  // Exposure the API to users
  var NotificationAPI = {
    // the entry of API
    render(options) {
      if(options.time && isNaN(Number(options.time))) {
        throw new Error('the duration property is not a number or a string of digital in options object');
      }
      options.queue === true ? relatedFunction.queueModeRender(options) : relatedFunction.commonModeRender(options);
    },

    // the method for extend custom type and color;
    extend(options) {
      if(typeof options === 'object' && options.constructor === Object && Object.hasOwnProperty.call(options.constructor.prototype, 'isPrototypeOf')){
        relatedFunction.customType.push(options);
      }else {
        throw new Error("the extend method's argument(options) is not a valid object!");
      }
    }
  }
  

  // Notification's related methods 
  var relatedFunction = {
    container: null, // react组件的容器
    customType: [], // 自定义类型
    messageQueue: [], // 信息队列

    commonModeRender(options) {
      var _this = this, message, type, duration;
      message = options.message;
      type = options.type;
      duration = options.duration || 2000;
      if(document.getElementById('Notification')) {
        // avoid the notification is in the start&end's animate result in error occur
        if(timers.waiting) {
          timers.waiting && clearTimeout(timers.waiting);
          timers.end && clearInterval(timers.end);
          _this.removeDeadComponent(function(){
            document.body.appendChild(_this.container);
            ReactDOM.render(
              <Notification type={type} message={message} duration={duration} />, 
              document.getElementById('NotificationContainer')
            );
          });
        }
      } else {
        document.body.appendChild(_this.container);
        ReactDOM.render(
          <Notification type={type} message={message} duration={duration} />, 
          document.getElementById('NotificationContainer')
        );
      }
    },

    queueModeRender(options) {
      var _this = this, current, message, type, duration;
      _this.messageQueue.push(options);
      timers.queue = setInterval(function() {
        // queue message's priority is lower than common messgae, waiting for common message show end
        if(!timers.waiting && !timers.start && !timers.end) {
          // if the queue of message is empty, stop scan the queue
          if(!_this.messageQueue.length) {
            clearTimeout(timers.queue);
          } else {
            current = _this.messageQueue.shift(); // Pop-up current information from the queue
            message = current.message;
            type = current.type;
            duration = current.duration || 2000;
            document.body.appendChild(_this.container);
            ReactDOM.render(
              <Notification type={type} message={message} duration={duration} />, 
              document.getElementById('NotificationContainer')
            );
          }
        }
      }, 100);
    },

    createContainerDiv() {
      // we must create a container element for our content
      if(!document.getElementById('NotificationContainer')) {
        this.container = document.createElement('DIV');
        this.container.id = "NotificationContainer";
        this.container.style.cssText += "position: absolute;height:30px;left:0;right:0;bottom:0;overflow:hidden;";
      }
    },

    // clear the dom when the animate is over
    removeDeadComponent(callback) {
      timers.waiting = null;
      var notification = document.getElementById('Notification');
      var opacity = 1;
      var bottom = 0;
      // the notification is hiding by animate
      timers.end = setInterval(function(){
        //  the cause of the decimal point to use tofixed to ensure that the decimal digits is right
        opacity.toFixed(1) == '0.0'? opacity = 0 : opacity -= 0.05;
        bottom -= 1.5;
        if(opacity === 0) {
          clearInterval(timers.end);
          timers.end = null;
          ReactDOM.unmountComponentAtNode(relatedFunction.container);
          document.getElementById('NotificationContainer').remove();
          callback && callback();
          return;
        }
        notification.style.opacity = opacity;
        // for ie8
        notification.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity * 100 + ")";
        notification.style.bottom = bottom +'px';
      }, 16.7);
    }

  };
  
  // create a div as containter for the react component 
  relatedFunction.createContainerDiv();

  var Notification = React.createClass({

    getInitialState() {
      var style = {
        height: '30px',
        lineHeight: '30px',
      }
      var custom = relatedFunction.customType;
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
            // if custom type exist
            if(custom.length !== 0) {
              for(let i = 0; i < custom.length; i++) {
                if(this.props.type === custom[i].type) {
                  style.backgroundColor = custom[i].color;
                  break;
                } 
              }
            } else {
              style.backgroundColor = '#51b110';
            }
            break;
          }
      }

      return {
        messageStyle: style
      }
    },

    render() {
      return (
        <div id="Notification" style={notificationStyle}>
          <div style={this.state.messageStyle} ref="div">{this.props.message}</div>
        </div>
      )
    },

    componentDidMount() {
      var _this = this;
      var notification = ReactDOM.findDOMNode(this);
      var opacity = 0;
      var bottom = -30;
      timers.start = setInterval(function() {
        opacity.toFixed(1) == '1.0'? opacity = 1 : opacity += 0.05;
        bottom += 1.5;
        if(opacity === 1) {
          clearInterval(timers.start);
          timers.start = null;
          // it's waiting for call the removeDeadComponent function as usual
          timers.waiting = setTimeout(function(){
            relatedFunction.removeDeadComponent();
          }, _this.props.duration);
        }
        notification.style.opacity = opacity;
        notification.style.bottom = bottom + 'px';
        // for ie8
        notification.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + opacity * 100 + ")";
      }, 16.7);
    }
  });

  return NotificationAPI;

}));
