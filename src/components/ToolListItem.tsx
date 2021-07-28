import React from 'react';
import { Alert, Avatar, Box, Button, IconButton, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { hasParams, DataType, isMultipleChoiceParam, ToolParameter, ToolParameterType, ToolWithTypePath } from "../tools/types";
import { Clear } from '@material-ui/icons';

type ToolListItemProps<S extends DataType, T extends DataType> = {
  tool: ToolWithTypePath<S, T>,
  updateTool: (toolWithTypePath: ToolWithTypePath<S, T>) => void,
  index: number,
  isFocused: boolean,
  isError: boolean,
  onClick: () => void,
  onDelete: () => void,
}

const ToolListItem: React.FC<ToolListItemProps<any, any>> = (props) => {
  const { tool, updateTool, index, isFocused, isError, onClick, onDelete } = props;
  const [params, setParams] = useState(hasParams(tool) ? tool.params : undefined);

  const updateParams = () => {
    const newTool: ToolWithTypePath<any, any, any> = {
      ...tool,
      params: params as any,
    }
    updateTool(newTool);
  }

  function onParamChange<T extends ToolParameterType> (param: ToolParameter<T>, key: string, newValue: typeof param.value) {
    let newParamValue = newValue;
    if (!isMultipleChoiceParam(param) && param.valueType === 'number')
      newParamValue = Number(newValue) as unknown as typeof param.value;
    const newParams = {
      ...params,
    };
    newParams[key] = {
      ...param,
      value: newParamValue,
    };
    setParams(newParams);
  }

  return <div style={{ opacity: isFocused || isError ? 1 : 0.5 }}>
    <ListItem button onClick={onClick}>
      <ListItemAvatar>
        <Avatar>{index + 1}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={tool.name}
        secondary={
          <React.Fragment>

            {/* {tool.inputType + ' > ' + tool.outputType} */}
            {/* <br/> */}
            {tool.getHistoryDescription()}
          </React.Fragment>
        } />
      <IconButton aria-label="delete tool from all steps" onClick={(event) => {
        event.stopPropagation();
        onDelete();
      }}>
        <Clear></Clear>
      </IconButton>
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

            if (isMultipleChoiceParam(param)) {
              return <Select
                value={param.value}
                onChange={(event) => {
                  onParamChange(param, key, event.target.value);
                }}
              >
                {param.choices.map((choice, index) => {
                  return <MenuItem key={index} value={choice}>{choice}</MenuItem>
                })}
              </Select>
            } else {
              return <TextField
              fullWidth
              key={index}
              required={param.required}
              label={param.name}
              value={param.value}
              onChange={(event) => {
                onParamChange(param, key, event.target.value);
              }}
            >
              {param.name}
            </TextField>;
            }
          }
          )}
        </form>
        <Button type='submit' onClick={(event) => {
          updateParams();
        }}>
          Apply
        </Button>
      </Box>

    }
  </div>
}

export default ToolListItem;