/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */
var spawner = {
    roles: [
        {
            name: 'harvester',
            amount: 2
        },
        {
            name: 'builder',
            amount: 2
        },
        {
            name: 'upgrader',
            amount: 2
        }
        ],
    spawnAsNeeded: function(roomName) {
        for ( var role of this.roles) { 
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
            console.log(`${role.name}:` + harvesters.length);
            
            if(harvesters.length < role.amount) {
                var newName = `${role.name}` + harvesters.length+1;
                console.log('Spawning new creep: ' + newName);
                Game.spawns[roomName].spawnCreep([WORK,CARRY,MOVE], newName, 
                    {memory: {role: role.name}});
            }
            
            if(Game.spawns[roomName].spawning) { 
                var spawningCreep = Game.creeps[Game.spawns[roomName].spawning.name];
                Game.spawns[roomName].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[roomName].pos.x + 1, 
                    Game.spawns[roomName].pos.y, 
                    {align: 'left', opacity: 0.8});
            }
        }
    }
};

module.exports = spawner;