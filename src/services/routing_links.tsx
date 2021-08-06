import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { Request } from "../custom_types/custom_types";
import Box from "@material-ui/core/Box";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";

export function systemLink(text: string, params: string[]): JSX.Element {
  return <RouterLink to={"/systems/" + params.join("/")}>{text}</RouterLink>;
}

export function jobLink(name: string, id: string): JSX.Element {
  return <RouterLink to={"/jobs/" + id}>{name}</RouterLink>;
}

export function requestLink(request: Request): JSX.Element {
  if (request.parent) {
    return (
      <Box>
        <RouterLink to={"/requests/" + request.parent.id}>
          <SubdirectoryArrowRightIcon />
        </RouterLink>
        <RouterLink to={"/requests/" + request.id}>
          {request.command}
        </RouterLink>
      </Box>
    );
  } else {
    return (
      <RouterLink to={"/requests/" + request.id}>{request.command}</RouterLink>
    );
  }
}
