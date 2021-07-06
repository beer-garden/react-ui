import axios from "axios";

class SystemsService {
  dataFetch(self: any) {
    let url = "/api/v1/systems";
    //	    url = url.replace('{start}', start).replace('{length}', length);
    axios.get(url).then((response) => {
      self.successCallback(response);
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

  getSystem(systems: any, namespace: string, name: string, version: string) {
    return systems.find(function (system: any) {
      return (
        system["name"] === name &&
        system["version"] === version &&
        system["namespace"] === namespace
      );
    });
  }

  filterSystems(systems: any, params: any) {
    if (params.name) {
      systems = systems.filter(function (system: any) {
        return system["name"] === params.name;
      });
    }
    if (params.namespace) {
      systems = systems.filter(function (system: any) {
        return system["namespace"] === params.namespace;
      });
    }
    if (params.version) {
      systems = systems.filter(function (system: any) {
        return system["version"] === params.version;
      });
    }
    return systems;
  }

  getCommand(commands: any, name: string) {
    return commands.find(function (command: any) {
      return command["name"] === name;
    });
  }
}

const item = new SystemsService();

export default item;
