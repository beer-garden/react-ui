import axios from 'axios';

class SystemsService {

    dataFetch(self) {
        let url = '/api/v1/systems';
//	    url = url.replace('{start}', start).replace('{length}', length);
        axios.get(url)
            .then(response => {
                self.successCallback(response);
            })
    }

    reloadSystem(system_id) {
        axios.patch('/api/v1/systems/' + system_id,
            {operation: 'reload', path: '', value: ''})
    }

    deleteSystem(system_id) {
        axios.delete('/api/v1/systems/' + system_id);
    }


    getSystem(systems, namespace, name, version) {
        return systems.find(function (system) {
            return system['name'] === name && system['version'] === version && system['namespace'] === namespace;
        })
    }

    filterSystems(systems, params) {
        if (params.name) {
            systems = systems.filter(function (system) {
                return system['name'] === params.name;
            })
        }
        if (params.namespace) {
            systems = systems.filter(function (system) {
                return system['namespace'] === params.namespace;
            })
        }
        if (params.version) {
            systems = systems.filter(function (system) {
                return system['version'] === params.version;
            })
        }
        return systems;
    }

    getCommand(commands, name) {
        return commands.find(function (command) {
            return command['name'] === name;
        })
    }


}

const item = new SystemsService();

export default item