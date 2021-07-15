import axios from "axios";
import { System } from "../custom_types/custom_types";

class InstanceService {
  startSystem(system: System) {
    for (const i in system.instances) {
      const instance = system.instances[i];
      this.startInstance(instance.id);
    }
  }

  stopSystem(system: System) {
    for (const i in system.instances) {
      const instance = system.instances[i];
      this.stopInstance(instance.id);
    }
  }

  startInstance(instance_id: string) {
    axios.patch("/api/v1/instances/" + instance_id, { operation: "start" });
  }

  stopInstance(instance_id: string) {
    axios.patch("/api/v1/instances/" + instance_id, { operation: "stop" });
  }
}

const item = new InstanceService();

export default item;
