import axios from "axios";

class RequestService {
  createRequest(self: any, model: any) {
    axios
      .post("/api/v1/requests", model)
      .then((response) => self.successCallback(response));
  }

  dataFetch(self: any, data: any[]) {
    let url = "/api/v1/requests?";
    for (let key in data) {
      if (key === "columns" || key === "order") {
        for (let columnsKey in data[key]) {
          url = url
            .concat(key)
            .concat("=")
            .concat(JSON.stringify(data[key][columnsKey]))
            .concat("&");
        }
      } else if (key === "search") {
        url = url.concat(key).concat("=").concat(JSON.stringify(data[key]));
      } else {
        url = url.concat(key).concat("=").concat(data[key]);
      }
      if (key !== "start" && key !== "columns" && key !== "order") {
        url = url.concat("&");
      }
    }
    let pieces = url.split("{");
    url = pieces.join("%7B");
    pieces = url.split("}");
    url = pieces.join("%7D") + "&timestamp=" + new Date().getTime().toString();
    axios.get(url).then((response) => {
      self.successCallback(response);
    });
  }

  getRequest(self: any, id: string) {
    let url = "/api/v1/requests/".concat(id);
    axios.get(url).then((response) => {
      self.successCallback(response);
    });
  }
}

const item = new RequestService();

export default item;
