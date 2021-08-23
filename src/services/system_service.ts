import axios from "axios";
import { Command, SuccessCallback, System } from "../custom_types/custom_types";

class SystemsService {
  getSystems(successCallback: SuccessCallback) {
    const url = "/api/v1/systems";
    axios.get(url).then((response) => {
      successCallback(response);
    });
  }

  reloadSystem(system_id: string) {
    axios.patch("/api/v1/systems/" + system_id, {
      operation: "reload",
      path: "",
      value: "",
    });
  }

  deleteSystem(system_id: string) {
    axios.delete("/api/v1/systems/" + system_id);
  }

  getSystem(
    systems: System[],
    namespace: string,
    name: string,
    version: string
  ) {
    return systems.find(function (system: System) {
      return (
        system["name"] === name &&
        system["version"] === version &&
        system["namespace"] === namespace
      );
    });
  }

  sortSystemsVersion(systems: System[]) {
    systems.sort((a, b) => (a.version > b.version ? -1 : 1));
    return systems;
  }

  filterSystems(
    systems: System[],
    params: {
      name?: string | undefined;
      namespace?: string | undefined;
      version?: string | undefined;
    }
  ) {
    if (params.name) {
      systems = systems.filter(function (system: System) {
        return system["name"] === params.name;
      });
    }
    if (params.namespace) {
      systems = systems.filter(function (system: System) {
        return system["namespace"] === params.namespace;
      });
    }
    if (params.version) {
      systems = systems.filter(function (system: System) {
        return system["version"] === params.version;
      });
    }
    return systems;
  }

  getCommand(commands: Command[], name: string) {
    return commands.find(function (command: Command) {
      return command["name"] === name;
    });
  }
}

const item = new SystemsService();

export default item;
