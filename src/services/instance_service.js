import axios from 'axios';

class InstanceService {

    startSystem(system) {
        for (let i in system.instances) {
            let instance = system.instances[i];
            this.startInstance(instance.id);
        }
    }

    stopSystem(system) {
        for (let i in system.instances) {
            let instance = system.instances[i];
            this.stopInstance(instance.id);
        }
    }

    startInstance(instance_id) {
        axios.patch('/api/v1/instances/' + instance_id, {operation: 'start'},);
    }

    stopInstance(instance_id) {
        axios.patch('/api/v1/instances/' + instance_id, {operation: 'stop'},);
    }


}

const item = new InstanceService();

export default item