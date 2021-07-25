import React, { useMemo, useState } from 'react';
import './App.css';
import { Tools } from './tools/tools';
import { Tool, TypeName, Data, isElementWiseTool, ElementWiseTool, ListData, DataBuilder } from './tools/types';
import { Box, Button, Container, createTheme, CssBaseline, Divider, Drawer, Grid, TextField, ThemeProvider, Tooltip, Typography } from '@material-ui/core';
import ToolListItem from './components/ToolListItem';
import ReactJson from 'react-json-view';
import { truncate } from './tools/string-utils';
import { stringify } from './tools/string-tools';
import assert from 'assert';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFF00',
    },
    text: {
      primary: '#FFFFFF',
    },
    background: {
      default: '#201B2D',
    },
  },
  typography: {
    fontFamily: [
      'Roboto Mono',
      'monospace',
    ].join(','),
  }
});

// function isUserEditOperation<S, T>(operation: Operation<S, T>): operation is UserEditOperation<S, T> {
//   return (operation as UserEditOperation<S, T>).before !== undefined && (operation as UserEditOperation<S, T>).after !== undefined;
// }

// function isToolOperation<S, T>(operation: Operation<S, T>): operation is ToolOperation<S, T> {
//   return (operation as ToolOperation<S, T>).tool !== undefined;
// }

class TransformationException {
  constructor(index: number, value: any) {
    this.index = index;
    this.value = value;
  }
  index: number;
  value: any;
}

const App: React.FC = () => {
  const initialData = useMemo(() => DataBuilder.from(''), []);
  const [toolHistory, setToolHistory] = useState<Tool<any, any, any>[]>([]);

  const [currentStepIndex, currentData] = useMemo<[number, Data<any>]>(() => {
    try {
      const value = toolHistory.reduce((prevValue, currTool, currentIndex) => {
        try {
          console.log(currTool.name);
          console.log(currTool);
          if (isElementWiseTool(currTool)) {
            console.log('this is an element wise tool');
            return (prevValue as ListData).childrenTransformedWith(currTool);
          } else {
            assert(currTool.inputType === prevValue.getType());
            return prevValue.transformedWith(currTool);
          }
        } catch (e) {
          throw new TransformationException(currentIndex - 1, prevValue);
        }
      }, initialData as Data<any>);
      return [toolHistory.length - 1, value];
    } catch (e) {
      const exception = e as TransformationException;
      return [exception.index, exception.value];
    }

  }, [initialData, toolHistory]);

  const latestTool = useMemo(() => {
    return toolHistory[currentStepIndex];
  }, [toolHistory, currentStepIndex]);

  const fakeStep = useMemo(() => typeof (currentData) === 'string' ? null : stringify, [currentData]);
  const fullHistory = [...toolHistory];

  // if (fakeStep !== null)
    // fullHistory.splice(currentStepIndex + 1, 0, fakeStep);


  const text = useMemo(() => {
    return currentData.transformedWith(stringify).get();
  }, [currentData]);

  const addTool = (tool: Tool<any, any>) => {
    const newToolHistory = [...toolHistory];


    if (newToolHistory.length > 0) {
      if (newToolHistory[newToolHistory.length - 1].name === 'Text input') {
        if (tool.name === 'Text input') {
          newToolHistory.pop();
        }
      }
    }

    newToolHistory.push(tool);
    setToolHistory(newToolHistory);
    return;
  }

  const onTextEdit = (oldValue: string, newValue: string) => {
    addTool({
      name: 'Text input',
      description: 'You typed this value in.',
      transform: (_) => {
        return newValue;
      },
      inputType: 'string',
      outputType: 'string',
      getHistoryDescription: function () {
        return `Entered "${truncate(newValue)}"`;
      }
    });
  }

  const categorizeTools = (tools: Tool<any, any>[], inputType: TypeName<any>): Map<string, Tool<any, any>[]> => {
    const usableTools = tools.filter((tool) => tool.inputType === inputType);
    const toolsByCategory = usableTools.reduce(
      (entryMap, e) => entryMap.set(e.outputType, [...entryMap.get(e.outputType) || [], e]),
      new Map()
    );
    if (inputType === 'list')
      toolsByCategory.set('item tools', tools.filter((tool) => tool.inputType === 'string').map((tool) => {
        return {
          ...tool,
          isElementWise: true,
        } as ElementWiseTool<any, any>;
      }));
    return toolsByCategory;
  }

  const currentDataType = latestTool?.outputType ?? 'string';

  const categorizedTools = categorizeTools(Tools, currentDataType);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <Drawer
          sx={{
            width: 400,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 400,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box mt={4}>
            <Typography variant='h5' gutterBottom>History</Typography>
            {
              fullHistory.map((tool, index) =>
                <div>
                  <ToolListItem
                    key={index + ' ' + tool.name}
                    {...{ tool }}
                    updateTool={(tool) => {
                      const newToolHistory = [...toolHistory];
                      newToolHistory[index] = tool;
                      setToolHistory(newToolHistory);
                    }}
                    index={index}
                    isFocused={index === currentStepIndex}
                    isError={index === currentStepIndex + 1 && tool !== fakeStep}
                  >
                  </ToolListItem>
                  <Divider></Divider>
                </div>
              )
            }
          </Box>
        </Drawer>
        <Container>
          <Box mt={4}>
            <Grid container>
              <Grid item xs={6}>
                {/* Current text:
                <br />
                <mark>{text}</mark>
                <br /> */}
                <form noValidate autoComplete='off'>
                  <TextField
                    label='Input'
                    value={text}
                    fullWidth
                    onChange={(event) => onTextEdit(text, event.target.value)}
                    minRows={10}
                    maxRows={30}
                    multiline
                  />
                </form>
              </Grid>
              <Grid item xs={6}>
                <ReactJson src={currentData} theme={{
                  base00: "1e1e3f",
                  base01: "43d426",
                  base02: "f1d000",
                  base03: "808080",
                  base04: "6871ff",
                  base05: "c7c7c7",
                  base06: "ff77ff",
                  base07: "ffffff",
                  base08: "d90429",
                  base09: "f92a1c",
                  base0A: "ffe700",
                  base0B: "3ad900",
                  base0C: "00c5c7",
                  base0D: "6943ff",
                  base0E: "ff2c70",
                  base0F: "79e8fb"
                }}></ReactJson>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='overline'>Current type: {currentDataType}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box mt={4}>
                  <Typography variant='h6'>Tools</Typography>
                  {
                    Array.from(categorizedTools.keys()).map((outputType) =>
                      <div>
                        <Typography variant='overline' component='div'>To {outputType}</Typography>
                        {
                          categorizedTools.get(outputType)!.map((tool) => <Tooltip title={tool.description}>
                            <Button
                              onClick={(event) => addTool(tool)}
                            >
                              {tool.name}
                            </Button>
                          </Tooltip>)
                        }
                      </div>
                    )
                  }
                </Box>
              </Grid>
              <Grid item xs={6}>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
