var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            this.harvest(creep);
            creep.say('Harvest');
        }
        else {
            this.storeEnergy(creep);
            creep.say('Store');
        }
    },

    harvest: function (creep) {
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    },

    storeEnergy: function (creep) {
        var priority = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        const secondary = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity);
            }
        })
        if (priority.length <= 0 ) {
            priority = secondary;
        }
        if (priority.length > 0) {
            if (creep.transfer(priority[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(priority[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleHarvester;