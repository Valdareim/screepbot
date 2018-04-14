/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */
var spawner = {
    units: [
        {
            type: {
                role: 'harvester',
                variant: 'small'
            },
            amount: 0,
            build: [WORK, CARRY, MOVE]
        },
        {
            type: {
                role: 'harvester',
                variant: 'medium'
            },
            amount: 5,
            build: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        },
        {
            type: {
                role: 'builder',
                variant: 'small'
            },
            amount: 2,
            build: [WORK, CARRY, MOVE]
        },
        {
            type: {
                role: 'builder',
                variant: 'medium'
            },
            amount: 2,
            build: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE]
        },
        {
            type: {
                role: 'upgrader',
                variant: 'small'
            },
            amount: 3,
            build: [WORK, CARRY, MOVE]
        },
        {
            type: {
                role: 'repairer',
                variant: 'small'
            },
            amount: 3,
            build: [WORK, CARRY, MOVE]
        },
    ],
    cleanMemory: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    spawnAsNeeded: function (roomName) {
        console.log('----------Unit Count----------')
        for (var unit of this.units) {
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == unit.type.role && creep.memory.variant == unit.type.variant);
            console.log(`${unit.type.role}(${unit.type.variant}): ${harvesters.length}/${unit.amount}`);

            if (Game.spawns[roomName].spawning) {
                var spawningCreep = Game.creeps[Game.spawns[roomName].spawning.name];
                Game.spawns[roomName].room.visual.text(
                    'Spawning: ' + spawningCreep.memory.role + spawningCreep.memory.variant,
                    Game.spawns[roomName].pos.x + 1,
                    Game.spawns[roomName].pos.y,
                    { align: 'left', opacity: 0.8 });
            } else if (harvesters.length < unit.amount) {
                var newName = `${unit.type.variant}${unit.type.role}` + Game.time;
                console.log('Spawning new creep: ' + newName);
                Game.spawns[roomName].spawnCreep(unit.build, newName,
                    { memory: unit.type });
            }


        }
    },
    renewNearby: function (roomName) {
        if (!Game.spawns[roomName].spawning) {
            const spawn = Game.spawns[roomName];
            const target = spawn.pos.findClosestByRange(FIND_CREEPS, {
                filter: object => object.ticksToLive < 1400
            });
            if (target !== null) {
                spawn.room.visual.text(`Renewing ${target.variant} - ${target.role}`);
                spawn.renewCreep(target);
            }
        }
    }
};

module.exports = spawner;