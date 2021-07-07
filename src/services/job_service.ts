import axios from "axios";

class JobService {
  TRIGGER_TYPES = ["cron", "date", "interval", "file"];
  CRON_KEYS = [
    "minute",
    "hour",
    "day",
    "month",
    "day_of_week",
    "year",
    "week",
    "second",
    "cron_jitter",
    "cron_start_date",
    "cron_end_date",
    "cron_timezone",
  ];
  INTERVAL_KEYS = [
    "interval_num",
    "interval",
    "interval_start_date",
    "interval_end_date",
    "interval_timezone",
    "interval_jitter",
    "interval_reschedule_on_finish",
  ];
  DATE_KEYS = ["run_date", "date_timezone"];
  FILE_KEYS = ["file_pattern", "file_path", "file_recursive", "file_callbacks"];
  SCHEMA = {
    type: "object",
    required: ["trigger_type", "name"],
    properties: {
      trigger_type: {
        title: "Trigger Type",
        description: "The type of trigger to create.",
        type: "string",
        enum: this.TRIGGER_TYPES,
      },
      name: {
        title: "Job Name",
        description: "A non-unique name for this job.",
        type: "string",
        minLength: 1,
      },
      misfire_grace_time: {
        title: "Misfire Grace Time",
        description: "Grace time for missed jobs.",
        type: "integer",
        minimum: 0,
        default: 5,
      },
      coalesce: {
        title: "Coalesce",
        type: "boolean",
        default: true,
      },
      max_instances: {
        title: "Max Instances",
        description: "Maximum number of concurrent job executions.",
        type: "integer",
        minimum: 1,
        default: 3,
      },
      run_date: {
        title: "Run Date",
        description: "Exact time to run this job.",
        type: "string",
        format: "date-time",
      },
      date_timezone: {
        title: "Timezone",
        description: "The timezone associated with this job.",
        type: "string",
        default: "UTC",
      },
      year: {
        title: "Year",
        description: "Cron year value",
        type: "string",
        default: "*",
      },
      month: {
        title: "Month",
        description: "Cron month value",
        type: "string",
        default: "1",
      },
      week: {
        title: "Week",
        description: "Cron week value",
        type: "string",
        default: "*",
      },
      day_of_week: {
        title: "Day Of Week",
        description: "Day of Week",
        type: "string",
        default: "*",
      },
      hour: {
        title: "Hour",
        description: "Cron hour value",
        type: "string",
        default: "0",
      },
      minute: {
        title: "Minute",
        description: "Cron minute value",
        type: "string",
        default: "0",
      },
      second: {
        title: "Second",
        description: "Cron second value",
        type: "string",
        default: "0",
      },
      day: {
        title: "Day",
        description: "Cron day value",
        type: "string",
        default: "1",
      },
      cron_end_date: {
        title: "End Date",
        description: "Date when the cron should end.",
        type: "string",
        format: "date-time",
      },
      cron_timezone: {
        title: "Timezone",
        description: "Timezone to apply to start/end date.",
        type: "string",
        default: "UTC",
      },
      cron_start_date: {
        title: "Start Date",
        description: "Date when the cron should start.",
        type: "string",
        format: "date-time",
      },
      cron_jitter: {
        title: "Cron Jitter",
        description:
          "Advance or delay job execute by this many seconds at most.",
        type: "integer",
        minimum: 0,
      },
      interval_end_date: {
        title: "End Date",
        description: "Date when the job should end.",
        type: "string",
        format: "date-time",
      },
      interval_timezone: {
        title: "Timezone",
        description: "Timezone to apply to start/end date.",
        type: "string",
        default: "UTC",
      },
      interval_start_date: {
        title: "Start Date",
        description: "Date when the job should start.",
        type: "string",
        format: "date-time",
      },
      interval: {
        title: "Interval",
        description: "Repeat this job every X of this interval",
        type: "string",
        enum: ["seconds", "minutes", "hours", "days", "weeks"],
        default: "hours",
      },
      interval_num: {
        title: "Interval Number",
        description: "Repeat this job every X of the interval",
        type: "integer",
        default: 1,
        minimum: 0,
      },
      interval_jitter: {
        title: "Interval Jitter",
        description:
          "Advance or delay job execute by this many seconds at most.",
        type: "integer",
        minimum: 0,
      },
      interval_reschedule_on_finish: {
        title: "Reschedule on Finish",
        description: "Reset the interval timer when the job finishes.",
        type: "boolean",
      },
      file_pattern: {
        title: "Pattern",
        description:
          "File name patterns to match, supports non-extended shell-style glob pattern matching",
        type: "array",
        items: {
          type: "string",
        },
      },
      file_path: {
        title: "Path",
        description: "Directory to watch.",
        type: "string",
      },
      file_recursive: {
        title: "Recursive",
        description: "Look more than one level deep in the directory.",
        type: "boolean",
      },
      file_callbacks: {
        title: "Callbacks",
        description: "What file events should trigger the plugins?",
        type: "object",
        properties: {
          on_created: { type: "boolean" },
          on_modified: { type: "boolean" },
          on_moved: { type: "boolean" },
          on_deleted: { type: "boolean" },
        },
      },
    },
  };
  MODEL = {
    misfire_grace_time: 5,
    coalesce: true,
    max_instances: 3,
    date_timezone: "UTC",
    year: "*",
    month: "1",
    week: "*",
    day_of_week: "*",
    hour: "0",
    minute: "0",
    second: "0",
    day: "1",
    cron_timezone: "UTC",
    interval_timezone: "UTC",
    interval: "hours",
    interval_num: 1,
    interval_reschedule_on_finish: false,
    file_recursive: false,
    file_callbacks: {
      on_created: false,
      on_modified: false,
      on_moved: false,
      on_deleted: false,
    },
    file_pattern: [""],
  };
  UISCHEMA = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/name",
      },
      {
        type: "Control",
        scope: "#/properties/trigger_type",
      },
      {
        type: "Categorization",
        elements: [
          {
            type: "Category",
            label: "Job Optional Fields",
            elements: [
              { type: "Control", scope: "#/properties/coalesce" },
              { type: "Control", scope: "#/properties/misfire_grace_time" },
              { type: "Control", scope: "#/properties/max_instances" },
            ],
          },
          {
            type: "Category",
            label: "Cron Trigger",
            elements: [
              {
                type: "HorizontalLayout",
                elements: [
                  { type: "Control", scope: "#/properties/minute" },
                  { type: "Control", scope: "#/properties/hour" },
                  { type: "Control", scope: "#/properties/day" },
                  { type: "Control", scope: "#/properties/month" },
                  { type: "Control", scope: "#/properties/day_of_week" },
                ],
              },
              {
                type: "HorizontalLayout",
                elements: [
                  {
                    type: "Control",
                    scope: "#/properties/year",
                  },
                  {
                    type: "Control",
                    scope: "#/properties/week",
                  },
                  {
                    type: "Control",
                    scope: "#/properties/second",
                  },
                  {
                    type: "Control",
                    scope: "#/properties/cron_jitter",
                  },
                ],
              },
              {
                type: "HorizontalLayout",
                elements: [
                  { type: "Control", scope: "#/properties/cron_start_date" },
                  { type: "Control", scope: "#/properties/cron_end_date" },
                  { type: "Control", scope: "#/properties/cron_timezone" },
                ],
              },
            ],
          },
          {
            type: "Category",
            label: "Interval Trigger",
            elements: [
              {
                type: "HorizontalLayout",
                elements: [
                  { type: "Control", scope: "#/properties/interval_num" },
                  { type: "Control", scope: "#/properties/interval" },
                  { type: "Control", scope: "#/properties/interval_jitter" },
                  {
                    type: "Control",
                    scope: "#/properties/interval_reschedule_on_finish",
                  },
                ],
              },
              {
                type: "HorizontalLayout",
                elements: [
                  {
                    type: "Control",
                    scope: "#/properties/interval_start_date",
                  },
                  { type: "Control", scope: "#/properties/interval_end_date" },
                  { type: "Control", scope: "#/properties/interval_timezone" },
                ],
              },
            ],
          },
          {
            type: "Category",
            label: "Date Trigger",
            elements: [
              {
                type: "HorizontalLayout",
                elements: [
                  { type: "Control", scope: "#/properties/run_date" },
                  { type: "Control", scope: "#/properties/date_timezone" },
                ],
              },
            ],
          },
          {
            type: "Category",
            label: "File Trigger",
            elements: [
              {
                type: "HorizontalLayout",
                elements: [
                  { type: "Control", scope: "#/properties/file_pattern" },
                  { type: "Control", scope: "#/properties/file_path" },
                  { type: "Control", scope: "#/properties/file_recursive" },
                  { type: "Control", scope: "#/properties/file_callbacks" },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  dataFetch(self: any) {
    let url = "/api/v1/jobs";
    //	    url = url.replace('{start}', start).replace('{length}', length);
    axios.get(url).then((response) => {
      self.successCallback(response);
    });
  }

  getJob(self: any, id: string) {
    let url = "/api/v1/jobs/".concat(id);
    axios.get(url).then((response) => {
      self.successCallback(response);
    });
  }

  getTrigger(triggerType: string, formModel: any) {
    if (triggerType === "date") {
      return {
        run_date: formModel["run_date"],
        timezone: formModel["date_timezone"],
      };
    } else if (triggerType === "interval") {
      let weeks = 0;
      let minutes = 0;
      let hours = 0;
      let seconds = 0;
      let days = 0;
      if (formModel["interval"] === "weeks") {
        weeks = formModel["interval_num"];
      } else if (formModel["interval"] === "minutes") {
        minutes = formModel["interval_num"];
      } else if (formModel["interval"] === "hours") {
        hours = formModel["interval_num"];
      } else if (formModel["interval"] === "seconds") {
        seconds = formModel["interval_num"];
      } else if (formModel["interval"] === "days") {
        days = formModel["interval_num"];
      }
      return {
        weeks: weeks,
        minutes: minutes,
        hours: hours,
        seconds: seconds,
        days: days,
        jitter: formModel["interval_jitter"],
        start_date: formModel["interval_start_date"],
        end_date: formModel["interval_end_date"],
        timezone: formModel["interval_timezone"],
        reschedule_on_finish: formModel["interval_reschedule_on_finish"],
      };
    } else if (triggerType === "file") {
      return {
        pattern: formModel["file_pattern"],
        path: formModel["file_path"],
        recursive: formModel["file_recursive"],
        callbacks: formModel["file_callbacks"],
      };
    } else {
      return {
        minute: formModel["minute"],
        hour: formModel["hour"],
        day: formModel["day"],
        month: formModel["month"],
        day_of_week: formModel["day_of_week"],
        year: formModel["year"],
        week: formModel["week"],
        second: formModel["second"],
        jitter: formModel["cron_jitter"],
        start_date: formModel["cron_start_date"],
        end_date: formModel["cron_end_date"],
        timezone: formModel["cron_timezone"],
      };
    }
  }

  formToServerModel(formModel: any, requestTemplate: any) {
    let serviceModel: any = {};
    serviceModel["name"] = formModel["name"];
    serviceModel["misfire_grace_time"] = formModel["misfire_grace_time"];
    serviceModel["trigger_type"] = formModel["trigger_type"];
    serviceModel["trigger"] = this.getTrigger(
      formModel["trigger_type"],
      formModel
    );
    serviceModel["request_template"] = requestTemplate;
    serviceModel["coalesce"] = formModel["coalesce"];
    serviceModel["max_instances"] = formModel["max_instances"];
    return serviceModel;
  }

  createJob(self: any, successCallback: any) {
    let model = this.formToServerModel(self.state.data, self.request);

    axios
      .post("/api/v1/jobs", model)
      .then((response) => successCallback(self, response));
  }

  pauseJob(self: any, jobId: string) {
    axios
      .patch("/api/v1/jobs/" + jobId, {
        operations: [
          {
            operation: "update",
            path: "/status",
            value: "PAUSED",
          },
        ],
      })
      .then((response) => self.successCallback(response));
  }

  deleteJob(self: any, jobId: string) {
    axios.delete("/api/v1/jobs/" + jobId).then(() => self.deleteCallback());
  }

  resumeJob(self: any, jobId: string) {
    axios
      .patch("/api/v1/jobs/" + jobId, {
        operations: [
          {
            operation: "update",
            path: "/status",
            value: "RUNNING",
          },
        ],
      })
      .then((response) => self.successCallback(response));
  }

  getRequiredKeys(triggerType: string) {
    if (triggerType === "cron") {
      let requiredKeys = [];
      for (let key of this.CRON_KEYS) {
        if (
          ![
            "cron_start_date",
            "cron_end_date",
            "cron_timezone",
            "cron_jitter",
          ].includes(key)
        ) {
          requiredKeys.push(key);
        }
      }
      return requiredKeys;
    } else if (triggerType === "date") {
      return this.DATE_KEYS;
    } else if (triggerType === "file") {
      return [];
    } else {
      let requiredKeys = [];
      for (let key of this.INTERVAL_KEYS) {
        if (
          ![
            "interval_start_date",
            "interval_end_date",
            "interval_timezone",
            "interval_jitter",
            "interval_reschedule_on_finish",
          ].includes(key)
        ) {
          requiredKeys.push(key);
        }
      }
      return requiredKeys;
    }
  }
}

const item = new JobService();

export default item;
