import axios from "axios";
import { SuccessCallback } from "../custom_types/custom_types";

class NamespaceService {
  getNamespaces(successCallback: SuccessCallback) {
    axios
      .get("/api/v1/namespaces?timestamp=" + new Date().getTime().toString())
      .then((response) => successCallback(response));
  }
}

const item = new NamespaceService();

export default item;
