var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
//var towers = require('object.tower');
var spawner = require('spawner');

module.exports.loop = function () {

    //towers.defend('SIMULATION ROOM');
    spawner.spawnAsNeeded('Spawn1');
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < 1 || creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
