const Sockets = require('../helpers/SocketStore');
const userORM = require('../models/user.model');
var socketStore = Sockets.getInstance();

var io = null;
const config = {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
};

/* Event handlers */
const onConnection = () => {
  io.on('connection', socket => {
    var userID = socket.handshake.headers.userid;
    console.log(`user ${userID} connected`);
    console.log(`socket id is ${socket.id}`);

    if (userID) {
      socketStore.sockets[userID] = socket.id;

      // Join user to all their rooms associated with their studygroups and following
      var errors = [];
      attendGroups(userID, socket, errors);
      followUsers(userID, socket, errors);
      if (errors.length > 0) console.log('Errors: ', errors);
    }
  });
  io.on('disconnect', () => {
    console.log('user disconnected');
  });
};

/**
 *
 * @param {string} userID
 * @param {array} errors
 * @description Join the rooms associated with each study group the user is registered to
 */
const attendGroups = async (userID, socket, errors) => {
  const usr = await userORM.findById(userID).catch(err => {
    errors.push(err);
    return;
  });
  const groupIDs = usr.registeredStudygroups.map(s => s.toString());
  await socket.join(groupIDs);
};
/**
 *
 * @param {string} userID
 * @param {array} followedUserIDs
 * @description Join the rooms associated with each followed user
 */
const followUsers = async (userID, socket, errors) => {
  const usr = await userORM.findById(userID).catch(err => {
    errors.push(err);
    return;
  });
  const userIDs = usr.profileFollowing.map(s => s.toString());
  await socket.join(userIDs);
  console.log(socket.rooms);
};

module.exports = {
  handleSocketIntegration(server) {
    const { Server, Socket } = require('socket.io');
    io = new Server(server, config);
    onConnection();
  },
  /* emit actions */
  emitGroupUpdated(groupID, groupTitle, action) {
    const titlePreview = groupTitle.substring(0, 15);
    var message = '';
    switch (action) {
      case 'edit':
        message = `Study group ${titlePreview}... has new changes!`;
        break;
      case 'cancel':
        message = `Study group ${titlePreview}... has been cancelled!`;
        break;
      case 'reactivate':
        message = `Study group ${titlePreview}... has been reactivated!`;
        break;
      default:
        console.log(`Err: action does not exist`);
        return;
    }
    // console.log(`Checking ${groupID} with the message ${message}`);
    // console.log('all rooms are: ', io.sockets.adapter.rooms);
    io.to(groupID).emit('group-change', message, groupID);
    //io.emit('group-change', message);
  },
  emitFollowedUpdates(followedUserID, followedUserName, action) {
    var message = '';
    switch (action) {
      case 'attend':
        message = `${followedUserName} has joined a new study group!`;
        break;
      case 'host':
        message = `${followedUserName} is hosting a new study group!`;
        break;
      default:
        console.log(`Err: action does not exist`);
        return;
    }
    io.to(followedUserID).emit('followed-user-update', message, followedUserID);
  },
  async attendGroups(userID, groupIDs, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      //console.log('socket is, ', io.sockets.sockets.get(socketID));
      await io.sockets.sockets.get(socketID).join(groupIDs);
      //console.log(socket.rooms);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
  async leaveGroups(userID, groupIDs, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      await io.sockets.sockets.get(socketID).leave(groupIDs);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
  async followUsers(userID, followedUserID, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      await io.sockets.sockets.get(socketID).join(followedUserID);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
  async unfollowUsers(userID, followedUserID, errors) {
    if (userID in socketStore.sockets) {
      const socketID = socketStore.sockets[userID];
      await io.sockets.sockets.get(socketID).leave(followedUserID);
    } else {
      errors.push('User was not found!');
      console.log('User was not found!');
    }
  },
};