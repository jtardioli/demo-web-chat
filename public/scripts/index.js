// Wraps everything in an IIFE, also protects `$` operator 
($ => {

  $(function() {
    const socket = setupSocket();

    $("#active").on('click', function() {
      const name = $("#name").val();
      login(socket, name);
    });

    $("#logout").on('click', function() {
      const name = $("#name").val();
      logout(socket);
    });

    $("#send").on('click', function(event) {
      send(socket);
    });

    $("#clear").on('click', function(event) {
      $("#messages").empty();
    });


  });

  // Create socket and add listeners
  const setupSocket = function() {

    // "io" comes from the included socket.io file (index.html)
    const socket = io();
    socket.on('connect', event => {
      console.log("connected");
    });


    // Messages can have different event names
    // handle "system" events (from server to us)
    socket.on('system', function(msg) {
      $(".system").html(msg);
    });

    // handle "status" events
    socket.on('status', function(msg) {
      console.log(msg);
      $(".connected").html(msg.connected);
      $(".active").html(msg.active);
    });

    // handle "message" events
    socket.on('private', function(msg) {
      console.log(msg);
      $("#messages").prepend(`<li class="private">${msg.from} says: ${msg.text}</li>`);
    });

    // handle "message" events
    socket.on('public', function(msg) {
      console.log(msg);
      $("#messages").prepend(`<li class="public">${msg.from} says: ${msg.text}</li>`);
    });

    return socket;
  };

  // Send a login event to the server
  const login = function(socket, name) {
    console.log("login", name);
    if (socket && name) {
      socket.emit('login', name);
    }
  };

  // Send an logout event to the server
  const logout = function(socket) {
    console.log("logout");
    if (socket) {
      socket.emit('logout');
    }
  };

  // Send chat message to the server
  const send = function(socket) {
    const to = $("#to").val();
    const text = $("#message").val();
    console.log("send:", to, text);
    if (socket && text) {
      socket.emit('chat', { text, to });
    }
  };

})(jQuery);
