import React from 'react';
import { Alert, Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { hasParams, Tool, DataType } from "../tools/types";

type ToolListItemProps<S extends DataType, T extends DataType> = {
  tool: Tool<S, T>,
  updateTool: (tool: Tool<S, T>) => void,
  index: number,
  isFocused: boolean,
  isError: boolean,
}

const ToolListItem: React.FC<ToolListItemProps<any, any>> = (props) => {
  const { tool, updateTool, index, isFocused, isError } = props;
  const [params, setParams] = useState(hasParams(tool) ? tool.params : undefined);

  const updateParams = () => {
    const newTool: Tool<any, any, any> = {
      ...tool,
      params: params as any,
    }
    updateTool(newTool);
  }

  return <div style={{ opacity: isFocused || isError ? 1 : 0.5 }}>
    <ListItem button>
      <ListItemAvatar>
        <Avatar>{index + 1}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={tool.name + ' ' + ((tool as any).params)}
        secondary={
          <React.Fragment>
              
          {/* {tool.inputType + ' > ' + tool.outputType} */}
              {/* <br/> */}
              {tool.getHistoryDescription()}
            </React.Fragment>
          } />
    </ListItem>
    {isError && <Alert severity="error">This doesn't work!</Alert>}
    {params &&
      <Box ml={2} mr={2}>
        <Typography variant='overline'>Parameters</Typography>
        <form onSubmit={(event) => {
          event.preventDefault();
        return updateParams();
      }} autoComplete='off'>
          {Object.keys(params).map((key, index) => {
            const param = params[key];
            return <TextField
              fullWidth
              key={index}
              required={param.required}
              label={param.name}
              value={param.value}
              onChange={(event) => {
                const newParams = {
                  ...params,
                };
                newParams[key] = {
                  ...param,
                  value: event.target.value,
                };
                setParams(newParams);
              }}
            >
              {param.name}
            </TextField>;
          }
          )}
        </form>
        <Button onClick={(event) => {
          updateParams();
        }}>
          Apply
        </Button>
      </Box>

    }
  </div>
}

export default ToolListItem;