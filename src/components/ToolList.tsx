import { Box, Button, Card, CardContent, Tooltip, Typography } from "@material-ui/core";
import { ToolMap, ToolWithTypePath, TypeName } from "../tools/types";

type ToolListProps = {
  toolMap: ToolMap;
  addTool: (toolWithTypePath: ToolWithTypePath<any, any>) => void;
  typePath: TypeName<any>[],
};

const ToolList: React.FC<ToolListProps> = (props) => {
  const { toolMap, addTool, typePath } = props;
  return (
    <div>
      <Typography variant="overline">{typePath.join(" > ")}</Typography>
      {Array.from(toolMap.self.keys()).map((outputType, index) => (
        <Box mt={index > 0 ? 2 : 0}>
          <Typography variant="overline" color="text.secondary" component="div">
            {outputType}
          </Typography>
          {toolMap.self.get(outputType)!.map((tool) => (
            <Tooltip title={tool.description}>
              <Box marginRight={1} component="span">
                <Button onClick={() => {
                  return addTool({ ...tool, typePath });
                }} variant="outlined">
                  {tool.name}
                </Button>
              </Box>
            </Tooltip>
          ))}
        </Box>
      ))}
      {
        toolMap.children &&
        <Box mt={2}>
          <Card variant="outlined">
            <CardContent>
            <Typography gutterBottom variant="h6">
              For each list element
            </Typography>
              {
              Array.from(toolMap.children.values()).map((value, index) => (
                <ToolList key={index} toolMap={value} addTool={addTool} typePath={[...typePath, value.type]}></ToolList>
              ))
              }
            </CardContent>
          </Card>
        </Box>
        
        
      }
    </div>
  );
};

export default ToolList;
