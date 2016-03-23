
/* initialize datatypes for client/server */

function GalaxyInfo (uuid) {  
  this.name = 'anonymous';
  this.uuid = uuid;
  this.colourIndex = 0;
  this.image = '';
  this.socketID = '';
};


function setUserName (user, newName) {
  user.name = newName;
};


exports.GalaxyInfo = GalaxyInfo;
exports.setUserName = setUserName;