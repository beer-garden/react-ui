import axios from 'axios';

    class RequestService {

      createRequest(self, model){
        axios.post('/api/v1/requests', model)
            .then(response => self.successCallback(response));
      }

	  dataFetch(self, data) {
//	    let column = [{"data":"command","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"namespace","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"system","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"system_version","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"instance_name","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"status","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"created_at","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"comment","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"metadata","name":"","searchable":true,"orderable":true,"search":{"value":"","regex":false}},
//	     {"data":"id"}];
//	    let order = [{column: 6, dir: "desc"}]
//        search='value: "sleep_say",regex: true'
	    let url = '/api/v1/requests?';
//	    url = url.replace('{data}', data);
        for (let key in data){
            if (key === 'columns' || key === 'order'){
                for (let columnsKey in data[key]){
                    url=url.concat(key).concat('=').concat(JSON.stringify(data[key][columnsKey])).concat('&');
                }
            } else if (key === 'search'){
                url=url.concat(key).concat('=').concat(JSON.stringify(data[key]));
            }
            else {
                url=url.concat(key).concat('=').concat(data[key]);
            }
            if (key !== 'start' && key !== 'columns' && key !== 'order'){
                url=url.concat('&');
            }

        }
        let pieces = url.split('{');
        url = pieces.join('%7B');
        pieces = url.split('}');
        url = pieces.join('%7D')+'&timestamp='+(new Date().getTime()).toString();
        axios.get(url)
          .then(response => {
              self.successCallback(response);
          })
      }
      getRequest(self, id) {
      	    let url = '/api/v1/requests/'.concat(id);
              axios.get(url)
                .then(response => {
                    self.successCallback(response);
                })
            }
   }

//   order: [{column: 6, dir: "desc"}]

   const item = new RequestService();

   export default item