import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";

import PageHeader from "../components/page_header";
import Divider from "../components/divider";
import Table from "../components/table";
import {
  Request,
  RequestsSearchApi,
  SuccessCallback,
  TableState,
} from "../custom_types/custom_types";
import RequestService from "../services/request_service";
import { requestLink, systemLink } from "../services/routing_links";

const RequestApp = (): JSX.Element => {
  const [includeChildren, setIncludeChildren] = useState(false);
  const searchApi: RequestsSearchApi = {
    columns: [
      {
        data: "command",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "namespace",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "system",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "system_version",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "instance_name",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "status",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "created_at",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "comment",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      {
        data: "metadata",
        name: "",
        searchable: true,
        orderable: true,
        search: { value: "", regex: false },
      },
      { data: "id" },
      { data: "parent" },
    ],
    draw: 1,
    include_children: includeChildren,
    length: 5,
    order: [{ column: 6, dir: "desc" }],
    search: { value: "", regex: false },
    start: 0,
  };
  const requestService = new RequestService();
  const state: TableState = {
    apiDataCall: apiRequestCall,
    setSearchApi: setSearchApi,
    formatData: formatData,
    includeChildren: includeChildren,
    includePageNav: true,
    cacheKey: `lastKnown_${window.location.href}`,
    disableSearch: false,
    tableHeads: [
      "Command",
      "Namespace",
      "System",
      "Version",
      "Instance",
      "Status",
      "Created",
      "Comment",
    ],
  };

  function setSearchApi(value: string, id: string, setDateEnd = false) {
    if (parseInt(id)) {
      if (parseInt(id) === 6) {
        let dateStart = "";
        let dateEnd = "";
        if (setDateEnd) {
          dateStart = value.replace("T", "+");
        } else {
          dateEnd = value.replace("T", "+");
        }
        value = dateStart + "~" + dateEnd;
      }
      const temp = searchApi.columns[parseInt(id)];
      if (temp.search) {
        temp.search.value = value;
        searchApi.columns[parseInt(id)] = temp;
      }
    } else if (id === "draw" || id === "length" || id === "start") {
      searchApi[id] = parseInt(value);
    } else if (id === "include_children") {
      searchApi[id] = "true" === value;
    }
  }

  function apiRequestCall(
    page: number,
    rowsPerPage: number,
    successCallback: SuccessCallback
  ) {
    requestService.getRequests(successCallback, searchApi);
  }

  function formatData(requests: Request[]) {
    const tempData: (string | JSX.Element | null)[][] = [];
    for (const i in requests) {
      tempData[i] = [
        requestLink(requests[i]),
        requests[i].namespace,
        requests[i].system,
        systemLink(requests[i].system_version, [
          requests[i].namespace,
          requests[i].system,
          requests[i].system_version,
        ]),
        requests[i].instance_name,
        requests[i].status,
        new Date(requests[i].created_at).toString(),
        requests[i].comment,
      ];
    }
    return tempData;
  }

  const title = "Requests";

  const handleChange = (checked: boolean) => {
    setIncludeChildren(checked);
  };
  return (
    <Box>
      <PageHeader title={title} description={""} />
      <Divider />
      <Box display="flex" alignItems="flex-end">
        <Box>
          <Checkbox
            checked={includeChildren}
            onChange={() => {
              handleChange(!includeChildren);
            }}
          />
          Include Children
        </Box>
      </Box>
      <Table parentState={state} />
    </Box>
  );
};

export default RequestApp;
