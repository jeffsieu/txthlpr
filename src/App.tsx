import React, { useMemo, useState } from "react";
import "./App.css";
import { tools as allTools } from "./tools/tools";
import {
  Tool,
  Data,
  ListData,
  DataBuilder,
  ChildrenToolMap,
  SelfToolMap,
  ToolMap,
  ToolWithTypePath,
} from "./tools/types";
import {
  Box,
  Checkbox,
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import ToolListItem from "./components/ToolListItem";
import ToolList from "./components/ToolList";
import ReactJson from "react-json-view";
import { truncate } from "./tools/string-utils";
import { stringify } from "./tools/string-tools";
import JSON5 from "json5";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFF00",
    },
    text: {
      primary: "#FFFFFF",
    },
    background: {
      default: "#201B2D",
      paper: "#191622",
    },
  },
  typography: {
    fontFamily: ["Roboto Mono", "monospace"].join(","),
  },
});

class TransformationException {
  constructor(index: number, value: any) {
    this.index = index;
    this.value = value;
  }
  index: number;
  value: any;
}

const getChildrenTools = (
  tools: Tool<any, any>[],
  data: ListData
): ChildrenToolMap => {
  const childrenTypesArray = Array.from(data.childrenTypes);
  return childrenTypesArray
    .map((type) => {
      const child = data.children.find((child) => child.getType() === type)!;
      const childTools = getToolsForData(tools, child);
      // return childTools
      // for (let entry of Array.from(childTools.self.entries())) {
      //   const [key, toolList] = entry;
      //   newSelf.set(key, toolList.map((tool) => ({
      //     ...tool,
      //     isElementWiseTool: true,
      //   })));
      // }
      // const transformedToolMap = {
      //   self: newSelf,
      // }

      // if (childTools.children) {
      //   const newChildren = new Map() as ChildrenToolMap;
      //   for (let entry of Array.from(childTools.children.entries())) {
      //     const [key, toolMap] = entry;
      //     newSelf.set(key, toolMap.map((tool) => ({
      //       ...tool,
      //       isElementWiseTool: true,
      //     })));
      //   }
      //   // transformedToolMap.children = ;
      // }
      return childTools;
      // return transformedToolMap;
    })
    .reduce((map, currValue, index) => {
      return map.set(childrenTypesArray[index] + "", currValue);
    }, new Map() as ChildrenToolMap);
};

const getToolsForData = (tools: Tool<any, any>[], data: Data<any>): ToolMap => {
  const usableTools = tools.filter(
    (tool) => tool.inputType === "any" || tool.inputType === data.getType()
  );
  const toolsByCategory = usableTools.reduce((entryMap, e) => {
    const categoryName =
      e.inputType === e.outputType ? `${e.inputType} tools` : "Transform";
    return entryMap.set(categoryName, [
      ...(entryMap.get(categoryName) || []),
      e,
    ]);
  }, new Map() as SelfToolMap);

  if (data.getType() === "list") {
    const childrenMap = getChildrenTools(tools, data as ListData);
    return {
      self: toolsByCategory,
      type: data.getType(),
      children: childrenMap,
    };
  }

  return {
    self: toolsByCategory,
    type: data.getType(),
  };
};

const App: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<
    number | undefined
  >(undefined);
  const initialData = useMemo(() => DataBuilder.from(""), []);
  const [useJson5, setUseJson5] = useState(false);
  const [toolHistory, setToolHistory] = useState<ToolWithTypePath<any, any>[]>(
    []
  );
  const [currentStepIndex, currentData] = useMemo<[number, Data<any>]>(() => {
    try {
      const history =
        selectedStepIndex !== undefined
          ? toolHistory.slice(0, selectedStepIndex + 1)
          : toolHistory;
      const value = history.reduce((prevValue, currTool, currentIndex) => {
        try {
          return prevValue.transformedWith(currTool);
          // if (currTool.typePath.length > 1) {
          //   return (prevValue as ListData).childrenTransformedWith({
          //     ...currTool,
          //     typePath: currTool.typePath.slice(1),
          //   });
          // } else {
          //   assert(
          //     currTool.inputType === "any" ||
          //       currTool.inputType === prevValue.getType()
          //   );
          //   return prevValue.transformedWith(currTool);
          // }
        } catch (e) {
          throw new TransformationException(currentIndex - 1, prevValue);
        }
      }, initialData as Data<any>);
      return [
        Math.min(selectedStepIndex ?? Infinity, toolHistory.length - 1),
        value,
      ];
    } catch (e) {
      const exception = e as TransformationException;
      return [exception.index, exception.value];
    }
  }, [initialData, toolHistory, selectedStepIndex]);

  const fakeStep = useMemo(
    () => (typeof currentData === "string" ? null : stringify),
    [currentData]
  );
  const fullHistory = [...toolHistory];

  // if (fakeStep !== null)
  // fullHistory.splice(currentStepIndex + 1, 0, fakeStep);

  const text: string = useMemo(() => {
    if (currentData.getType() === 'json' || currentData.getType() === 'list') {
      if (useJson5) {
        return JSON5.stringify(currentData.get(), {quote: '"', space: 2});
      } else {
        return JSON.stringify(currentData.get(), null, 2);
      }
    } else {
      return currentData.get() + "";
    }
  }, [currentData, useJson5]);

  const wordCount = useMemo(() => text.trim().split(/\s+/).length, [text]);

  const addTool = (tool: ToolWithTypePath<any, any>) => {
    const newToolHistory = toolHistory.slice(0, currentStepIndex + 1);

    if (newToolHistory.length > 0) {
      if (newToolHistory[newToolHistory.length - 1].name === "Text input") {
        if (tool.name === "Text input") {
          newToolHistory.pop();
        }
      }
    }
    newToolHistory.push(tool);
    setToolHistory(newToolHistory);
    setSelectedStepIndex(currentStepIndex + 1);
    return;
  };

  const removeStep = (index: number) => {
    setToolHistory(toolHistory.slice(0, index));
  };

  const onTextEdit = (oldValue: string, newValue: string) => {
    addTool({
      name: "Text input",
      description: "You typed this value in.",
      transform: (_) => {
        return newValue;
      },
      inputType: "any",
      outputType: "string",
      typePath: ["string"],
      getHistoryDescription: function () {
        return `Entered "${truncate(newValue)}"`;
      },
    });
  };

  const currentDataType = currentData.getType();
  // const currentDataType = latestTool !== undefined ? (isElementWiseTool(latestTool) ? 'list' : latestTool.outputType) : 'string';

  const categorizedTools = getToolsForData(allTools, currentData);
  
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: 300,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 300,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box mt={4}>
            <Box marginX={2}>
              <Typography variant="h5" gutterBottom>
                Operations
              </Typography>
            </Box>
            {fullHistory.length === 0 && (
              <Box mx={2}>
                <Typography variant="body1" color="text.secondary">
                  Type something to begin
                </Typography>
              </Box>
            )}
            {fullHistory.map((tool, index) => (
              <div>
                <ToolListItem
                  onClick={() => {
                    setSelectedStepIndex(index);
                  }}
                  onDelete={() => {
                    removeStep(index);
                  }}
                  key={index + " " + tool.name}
                  {...{ tool }}
                  updateTool={(tool) => {
                    const newToolHistory = [...toolHistory];
                    newToolHistory[index] = tool;
                    setToolHistory(newToolHistory);
                  }}
                  index={index}
                  isFocused={index === currentStepIndex}
                  isError={
                    index === currentStepIndex + 1 &&
                    tool !== fakeStep &&
                    index - 1 !== selectedStepIndex
                  }
                ></ToolListItem>
                <Divider></Divider>
              </div>
            ))}
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Grid container>
            <Grid item xs={12} lg={6}>
              <Typography variant="h3" color="text.disabled" gutterBottom>
                txthlpr
              </Typography>
              {/* Current text:
              <br />
              <mark>{text}</mark>
              <br /> */}
              <form noValidate autoComplete="off">
                <TextField
                  label="Input"
                  value={text}
                  fullWidth
                  onChange={(event) => onTextEdit(text, event.target.value)}
                  minRows={20}
                  maxRows={30}
                  multiline
                />
              </form>
              <div>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  component="span"
                >
                  {[
                    `Type: ${currentDataType}`,
                    `Characters: ${text.length}`,
                    `Words: ${wordCount}`,
                  ].join(" | ")}
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useJson5}
                    onChange={() => setUseJson5(!useJson5)}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Use JSON5 formatting (for JSONs and lists)"
              />
              <Box mt={4}>
                <Typography variant="h6" color="text.secondary">
                  Tools
                </Typography>
                <ToolList
                  toolMap={categorizedTools}
                  addTool={addTool}
                  typePath={[currentData.getType()]}
                />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box mx={isLgDown ? 0 : 4} my={isLgDown ? 4 : 0}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Current data structure
                </Typography>
                <ReactJson
                  src={{ input: currentData.get() }}
                  collapseStringsAfterLength={30}
                  theme={{
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
                    base0F: "79e8fb",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default App;
