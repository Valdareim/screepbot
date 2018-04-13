var harvest = require('role.harvester');
var roleBuilder = {
    STATE_BUILDING: 'building',
    STATE_REPAIRING: 'repairing',
    STATE_GATHERING: 'gathering',

    /** @param {Creep} creep **/
    run: function (creep) {
        var targets;
        if (creep.memory.state != this.STATE_GATHERING && creep.carry.energy == 0) {
            creep.memory.state = this.STATE_GATHERING;
            creep.say('get energy');
        } else if (creep.memory.state == this.STATE_GATHERING && creep.carry.energy == creep.carryCapacity) {

            const buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            const repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            repairTargets.sort((a, b) => a.hits - b.hits);

            if (repairTargets.length > 0) {
                creep.memory.state = this.STATE_REPAIRING
                creep.memory.targetId = repairTargets[0].id;
                creep.say('repair');
            } else if (buildTargets.length > 0) {
                creep.memory.state = this.STATE_BUILDING;
                creep.memory.targetId = buildTargets[0].id;
                creep.say('build');
            }
        } else if ((creep.memory.state != this.STATE_GATHERING && creep.memory.state != this.STATE_REPAIRING && creep.memory.state != this.STATE_BUILDING) ||
            creep.memory.state != this.STATE_GATHERING && creep.memory.targetId === undefined) {
            creep.memory.state = this.STATE_GATHERING;
            creep.say('oops, getting energy');
        }

        switch (creep.memory.state) {
            case this.STATE_BUILDING:
                var target = Game.getObjectById(creep.memory.targetId);
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                break;
            case this.STATE_REPAIRING:
                var target = Game.getObjectById(creep.memory.targetId);
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                break;
            case this.STATE_GATHERING:
                this.getEnergy(creep);
                break;
        }
    },
    getEnergy: function (creep) {
        var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION) && structure.energy - creep.carryCapacity > 200;
            }
        });
        if (storage === null) {
            harvest.harvest(creep);
        } else {
            if (storage.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleBuilder;