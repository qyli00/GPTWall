import React, { useState, useEffect, useCallback, useRef, useLayoutEffect} from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Switch from '@mui/material/Switch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GradingIcon from '@mui/icons-material/Grading';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CancelIcon from "@mui/icons-material/Cancel";
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import FormControl from "@mui/material/FormControl";
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from "@mui/material/InputLabel";
import Input from '@mui/material/Input';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Draggable from 'react-draggable';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { DataGrid } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

import './App.css';
import { generateText, revise, getValue, snowball } from './utils.js';

import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges, 
  applyNodeChanges,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
  Panel,
} from 'reactflow';

import {diffWords} from 'diff';
import dagre from 'dagre';

import 'reactflow/dist/style.css';

import TextUpdaterNode from './TextUpdaterNode.js';
import TextUpdaterEdge from './TextUpdaterEdge.js';
import { HighlightOffOutlined, HighlightOffTwoTone, RemoveCircle } from "@mui/icons-material";

const nodeTypes = { textUpdaterNode: TextUpdaterNode}; 
const edgeTypes = { textUpdaterEdge: TextUpdaterEdge};

const drawerWidth = 400;

const UUID = crypto.randomUUID();

const colorSet = {"spoof": "brown", "noisify": "green", "flip": "cornflowerblue", "edit": "plum"}; // "add": "forestgreen", "delete": "crimson"};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function PaperComponent(props) {
  return (
    <Draggable
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} sx={{m: -1}} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ChevronRightOutlinedIcon sx={{ fontSize: '0.9rem'}} />}
    {...props}
  />
))(({ theme }) => ({
  // backgroundColor:
  //   theme.palette.mode === 'dark'
  //     ? 'rgba(255, 255, 255, .05)'
  //     : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  // padding: theme.spacing(2),
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


export default function App() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openAnnotation, setOpenAnnotation] = React.useState(true);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [userPrompts, setUserPrompts] = useState([]);
  const [revisePrompt, setRevisePrompt] = useState("");
  const currentPrompt = useRef();
  const allExamples = useRef({pos: [], neg: []});
  const allEffects = useRef([]);
  const currentEffects = useRef([]);

  const [text, setText] = useState("");
  const [posExamples, setPosExamples] = useState([]);
  const [negExamples, setNegExamples] = useState([]);
  const [itemList, setItemList] = useState([]);

  const [activeOperator, setActiveOperator] = useState("Spoof");
  const [currentTransform, setCurrentTransform] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [records, setRecords] = useState([]);

  const [objectiveType, setObjectiveType] = useState("");
  const [nodeCategory, setNodeCategory] = useState("All");
  const [nodeTypeList, setNodeTypeList] = useState([]);
  const [nodeLabelList, setNodeLabelList] = useState([]);
  const [edgeLabelList, setEdgeLabelList] = useState([]);
  const [selected, setSelected] = useState();

  const [fakeNum, setFakeNum] = useState(1);

  const [abbrMode, setAbbrMode] = useState(true);
  const [showChange, setShowChange] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showPolicy, setShowPolicy] = useState(true);
  const [menu, setMenu] = useState(null);

  const ref = useRef(null);

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const loadPrompts = async() => {
    // fetch('./sample/userPrompts.json')
    fetch('./sample/clinton_email.json')
    .then(response => response.text())
     .then(text => {
        setUserPrompts(JSON.parse(text));
    });
  };

  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    for (const change of changes) {
      if ((change.type === 'select' && change.selected === true) || change.type === 'position')
        setSelected(change.id);
    }
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    for (const change of changes) {
      if ((change.type === 'select' && change.selected === true) || change.type === 'position')
        setSelected(change.id);
    }
  };

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({...connection, type: 'textUpdaterEdge', data: {color: 'transparent'}}, eds));
  }, [setEdges]);

  const onContextMenu = useCallback(
    (event) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        top: event.clientY - pane.y,
        left: event.clientX - pane.x,
        right: pane.x + pane.width - event.clientX,
        bottom: pane.y + pane.height - event.clientY,
      });
    },
    [setMenu]
  );

  const createGraph = (e) => {
    const text = e.target.innerText;
    const graph = currentPrompt.current.graph;
    const nodes = [], edges = [];
    for (const node of graph.nodes) {
      if (text.includes(node.id)) {
        nodes.push({id: node.id, type: 'textUpdaterNode', data: {label: node.id, type: node.type, color: 'white'}});
      }
    }
    const nodesCache = [...nodes];
    for (const edge of graph.edges) {
      // check if the nodes already exist
      var source = nodesCache.find(node => node.id === edge.source);
      var target = nodesCache.find(node => node.id === edge.target);

      if ((source !== undefined || target !== undefined)) {
        if (source === undefined) {
          const node = graph.nodes.find(nd => nd.id === edge.source);
          if (node === undefined) {
            nodes.push({id: edge.source, type: 'textUpdaterNode', data: {label: edge.source, type: '', color: 'white'}});
          }
          else {
            nodes.push({id: node.id, type: 'textUpdaterNode', data: {label: node.id, type: node.type, color: 'white'}});
          }
        }
        else if (target === undefined) {
          const node = graph.nodes.find(nd => nd.id === edge.target);
          if (node === undefined) {
            nodes.push({id: edge.target, type: 'textUpdaterNode', data: {label: edge.target, type: '', color: 'white'}});
          }
          else {
            nodes.push({id: node.id, type: 'textUpdaterNode', data: {label: node.id, type: node.type, color: 'white'}});
          }
        }
        edges.push({id: `${edge.source}--[${edge.label}]--${edge.target}`, defaultValue: edge.label, type: 'textUpdaterEdge', 
                  source: edge.source, target: edge.target, data: {label: edge.label, color: 'transparent'}});
      }
    }

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 128;
    const nodeHeight = 36;

    const getLayoutedElements = (nodes, edges, direction = 'LR') => {
      const isHorizontal = direction === 'LR';
      dagreGraph.setGraph({ rankdir: direction });

      nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      nodes.forEach((node) => {
          const nodeWithPosition = dagreGraph.node(node.id);
          node.targetPosition = isHorizontal ? 'left' : 'top';
          node.sourcePosition = isHorizontal ? 'right' : 'bottom';
        
          // We are shifting the dagre node position (anchor=center center) to the top left
          // so it matches the React Flow node anchor point (top left).
          node.position = {
            x: nodeWithPosition.x * 2 - nodeWidth / 2,
            y: nodeWithPosition.y / 1.5 - nodeHeight / 2,
          };
      
          return node;
        });

        return { nodes, edges };
      };

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    var suggestion_list = [];
    if (posExamples.length > 0) {
      const type = posExamples[0].id.includes('--') ? 'edge' : 'node';
      const parameterList = snowball(type, userPrompts, posExamples, negExamples);
      for (const operator of Object.keys(colorSet)) {
        suggestion_list = suggestion_list.concat(parameterList.map(parameter => ({id: Date.now()+'_'+operator, fields: [{type: 'text', label: `${capitalize(operator)} ${type} with `}, ...parameter]})));
      }

      if (activeOperator !== "") {
        suggestion_list = suggestion_list.filter(suggestion => suggestion.id.includes(activeOperator)).concat(suggestion_list.filter(suggestion => !suggestion.id.includes(activeOperator)));
      }
      setSuggestions(suggestion_list);
    }
    else {
      setSuggestions([]);
    }
  }, [posExamples, negExamples]);

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.keyCode === 27) {
        setActiveOperator("");
        setCurrentTransform("");
        setSuggestions([]);
        currentEffects.current = [];
      }
      if (event.key === 'Enter') {
        const elementName = event.target.id;
        if (elementName !== undefined) {
          const value = event.target.value;
          if (elementName.includes('--')) {
            setEdges(eds => eds.map(edge => {
              if (edge.id === elementName) {
                edge.data = {...edge.data, label: value, color: "khaki"};
              }
              return edge;
            }));
            // setSuggestions([{id: `${Date.now()}_edit ` + elementName, fields: [{type: 'text', label: `Edit edge ${elementName} to `}, {type: 'input', defaultValue: value}]}]);
          }
          else {
            setNodes(nds => nds.map(node => {
              if (node.id === elementName) {
                node.data = {...node.data, label: value, color: "khaki"};
              }
              return node;
            }));
            // setSuggestions([{id: `${Date.now()}_edit ` + elementName, fields: [{type: 'text', label: `Edit node ${elementName} to `}, {type: 'input', defaultValue: value}]}]);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyboard);
  });

  function ContextMenu({ top, left, right, bottom, ...props }) {  
    return (
      <div style={{ top, left, right, bottom, position: 'absolute' }} className="context-menu" {...props}>
      <Paper sx={{ width: 200}}>
        <MenuList>
          <MenuItem sx={{height: 20}}>
            <ListItemButton onClick={() => {if (!posExamples.includes({id: selected, prompt: currentPrompt.current.title}))setPosExamples(examples => [...examples, {id: selected, prompt: currentPrompt.current.title}])}}>
            <ListItemIcon>
              <AddCircleOutlineIcon fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Mark as positive</ListItemText>
            </ListItemButton>
          </MenuItem>
          <Divider />
          <MenuItem sx={{height: 20}}>
            <ListItemButton onClick={() => setNegExamples(examples => [...examples, {id: selected, prompt: currentPrompt.current.title}])}>
            <ListItemIcon>
              <RemoveCircleOutlineIcon fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Mark as negative</ListItemText>
            </ListItemButton>
          </MenuItem>
        </MenuList>
      </Paper>
      </div>
    );
  }

  function Parameter({label, value, options, addPos, addNeg, remove, update}) {
    return (<Box sx={{ display: 'inline-flex', flexDirection: 'row', m: 1}}>
        <Autocomplete size="small" sx={{width: 210}}
          multiple
          options={options}
          getOptionLabel={(option) => option}
          value={value}
          limitTags={1}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option.val} {...getTagProps({ index })} 
                    style={{backgroundColor: option.label === 'pos' ? 'tomato' : 'springgreen', 
                            color: option.label === 'pos' ? 'seashell' : 'black'}} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label={label}/>
          )}
          renderOption={(props, option) => {
            const entry = value.find(entry => entry.val === option);
            if (entry === undefined) {
              return (
                    <ListItem {...props} align='center' >                       
                      <IconButton edge='start' onClick={(e) => {addPos(option); e.stopPropagation();}}> <AddCircleOutlineIcon style={{color: 'tomato'}}/> </IconButton> 
                      <ListItemText>{option}</ListItemText>
                      <IconButton edge='end' onClick={(e) => {addNeg(option); e.stopPropagation();}}> <RemoveCircleOutlineIcon style={{color: 'lawngreen'}}/> </IconButton>
                    </ListItem>
                  )
            }
            else {
              return <span {...props} style={{backgroundColor: (entry.label === 'pos') ? 'tomato' : 'springgreen', 
                                              color: entry.label === 'pos' ? 'seashell' : 'black'}}>
                      <ListItemText>{option}</ListItemText>
                      <IconButton onClick={(e) => {remove(option); e.stopPropagation();}}> <HighlightOffOutlinedIcon style={{color: 'grey'}}/> </IconButton>
                      </span>;
            }
          }}
          onChange={update}
        />
      </Box>);
  };
  
  function ParameterList() {
    const handleParamterChange = ()=>{
      if (activeOperator !== "") {
        const op_id = Date.now() + '_' + activeOperator;
        setCurrentTransform(op_id);
        if (activeOperator === "export") {
          const suggestion = {id: op_id, fields: [{type: 'text', label: `Export ${fakeNum} fake prompts`}]};
          setSuggestions([suggestion]);
          execute(suggestion);
        }
        else if (objectiveType !== '' && (nodeTypeList.length > 0 || nodeLabelList.length > 0 || edgeLabelList.length > 0)) {
          const params = [];
          if (objectiveType === 'node') {
            if (nodeTypeList.length > 0) params.push({type: 'param', label: 'Entity type', data: nodeTypeList});
            if (nodeLabelList.length > 0) params.push({type: 'param', label: 'Entity label', data: nodeLabelList});
            if (edgeLabelList.length > 0) params.push({type: 'param', label: 'Relation label', data: edgeLabelList});
          }
          else if(objectiveType === 'edge') {
            if (edgeLabelList.length > 0) params.push({type: 'param', label: 'Relation label', data: edgeLabelList});
            if (nodeTypeList.length > 0) params.push({type: 'param', label: 'Entity type', data: nodeTypeList});
            if (nodeLabelList.length > 0) params.push({type: 'param', label: 'Entity label', data: nodeLabelList});
          }
          const suggestion = {id: op_id, fields: [{type: 'text', label: `${activeOperator} ${objectiveType}s with `}, ...params]};
          setSuggestions([suggestion]);
          setCurrentTransform(suggestion.id);
          execute(suggestion);
        }
        else {
          setSuggestions([]);
        }
      }
    }

    if (activeOperator === "export") {
      return (<>
      {/* <FormControl sx={{m: 1, width: 160 }} size="small">
        <InputLabel>Target</InputLabel>
        <Select
          value={exportTarget}
          label="Target"
          onChange={(e) => setExportTarget(e.target.value)}
        >
          <MenuItem value={"current prompt"}>Current prompt</MenuItem>
          <MenuItem value={"all prompts"}>All prompts</MenuItem>
        </Select>
      </FormControl> */}

      <TextField size="small" sx={{m: 1, width: 120 }}
        select
        label="Numbers"
        defaultValue="1" 
        onChange={(e) => {setFakeNum(e.target.value); handleParamterChange();}}
      >
      {([1, 2, 3, "Automatic", 4, 5, 6, 7, 8, 9, 10]).map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      </>);
    }
    else {
      return (<><FormControl sx={{m: 1, width: 120 }} size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={objectiveType}
                label="Type"
                onChange={(e) => {setObjectiveType(e.target.value); handleParamterChange();}}
              >
                <MenuItem value={""}>None</MenuItem>
                <MenuItem value={"node"}>Entity</MenuItem>
                <MenuItem value={"edge"}>Relation</MenuItem>
              </Select>
            </FormControl>
            {(objectiveType === 'node') ? (<>
              {/* <FormControl sx={{m: 1, width: 120 }} size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={nodeCategory}
                label="Category"
                onChange={(e) => setNodeCategory(e.target.value)}
              >
                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={"Subjective"}>Subjective</MenuItem>
                <MenuItem value={"Objective"}>Objective</MenuItem>
              </Select> 
              </FormControl> */}

              <Parameter label={"Entity type"} value={nodeTypeList} 
                options={currentPrompt.current !== undefined ? [...new Set(currentPrompt.current.graph.nodes.map(nd => nd.type))] : []}
                addPos={option => {setNodeTypeList([...nodeTypeList, {val: option, label: 'pos'}]); handleParamterChange();}}
                addNeg={option => {setNodeTypeList([...nodeTypeList, {val: option, label: 'neg'}]); handleParamterChange();}}
                remove={option => {setNodeTypeList(nodeTypeList.filter(entry => entry.val !== option)); handleParamterChange()}}
                update={(events, values) => {if (values.length <= nodeTypeList.length) {setNodeTypeList(values); handleParamterChange();}}}
              />

              <Parameter label={"Entity label"} value={nodeLabelList} 
                options={currentPrompt.current !== undefined ? currentPrompt.current.graph.nodes.map(nd => nd.id) : []}
                addPos={option => {setNodeLabelList([...nodeLabelList, {val: option, label: 'pos'}]); handleParamterChange();}}
                addNeg={option => {setNodeLabelList([...nodeLabelList, {val: option, label: 'neg'}]); handleParamterChange();}}
                remove={option => {setNodeLabelList(nodeLabelList.filter(entry => entry.val !== option)); handleParamterChange();}}
                update={(events, values) => {if (values.length <= nodeLabelList.length) {setNodeLabelList(values); handleParamterChange();}}}
              />

              <Parameter label={"Relation label"} value={edgeLabelList} 
                options={currentPrompt.current !== undefined ? [...new Set(currentPrompt.current.graph.edges.map(ed => ed.label))] : []}
                addPos={option => {setEdgeLabelList([...edgeLabelList, {val: option, label: 'pos'}]); handleParamterChange();}}
                addNeg={option => {setEdgeLabelList([...edgeLabelList, {val: option, label: 'neg'}]); handleParamterChange();}} 
                remove={option => {setEdgeLabelList(edgeLabelList.filter(entry => entry.val !== option)); handleParamterChange();}}
                update={(events, values) => {if (values.length <= edgeLabelList.length) {setEdgeLabelList(values); handleParamterChange();}}}
              />
            </>
            )
            : (objectiveType === 'edge') ? (<>
              <Parameter label={"Relation label"} value={edgeLabelList} 
                options={currentPrompt.current !== undefined ? [...new Set(currentPrompt.current.graph.edges.map(ed => ed.label))] : []}
                addPos={option => {setEdgeLabelList([...edgeLabelList, {val: option, label: 'pos'}]); handleParamterChange();}}
                addNeg={option => {setEdgeLabelList([...edgeLabelList, {val: option, label: 'neg'}]); handleParamterChange();}} 
                remove={option => {setEdgeLabelList(edgeLabelList.filter(entry => entry.val !== option)); handleParamterChange();}}
                update={(events, values) => {if (values.length <= edgeLabelList.length) {setEdgeLabelList(values); handleParamterChange();}}}
              />

              {/* <FormControl sx={{m: 1, width: 120 }} size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={nodeCategory}
                  label="Category"
                  onChange={(e) => setNodeCategory(e.target.value)}
                >
                  <MenuItem value={"Any"}>Any</MenuItem>
                  <MenuItem value={"Source"}>Source</MenuItem>
                  <MenuItem value={"Target"}>Target</MenuItem>
                </Select> 
              </FormControl> */}

              <Parameter label={"Entity type"} value={nodeTypeList} 
                options={currentPrompt.current !== undefined ? [...new Set(currentPrompt.current.graph.nodes.map(nd => nd.type))] : []}
                addPos={option => {setNodeTypeList([...nodeTypeList, {val: option, label: 'pos'}]); handleParamterChange();}}
                addNeg={option => {setNodeTypeList([...nodeTypeList, {val: option, label: 'neg'}]); handleParamterChange();}}
                remove={option => {setNodeTypeList(nodeTypeList.filter(entry => entry.val !== option)); handleParamterChange();}}
                update={(events, values) => {if (values.length <= nodeTypeList.length) {setNodeTypeList(values); handleParamterChange();}}}
              />

              <Parameter label={"Entity label"} value={nodeLabelList} 
                options={currentPrompt.current !== undefined ? currentPrompt.current.graph.nodes.map(nd => nd.id) : []}
                addPos={option => {setNodeLabelList([...nodeLabelList, {val: option, label: 'pos'}]); handleParamterChange();}}
                addNeg={option => {setNodeLabelList([...nodeLabelList, {val: option, label: 'neg'}]); handleParamterChange();}}
                remove={option => {setNodeLabelList(nodeLabelList.filter(entry => entry.val !== option)); handleParamterChange();}}
                update={(events, values) => {if (values.length <= nodeLabelList.length) {setNodeLabelList(values); handleParamterChange();}}}
              />
            </>
            ) :  <></>}
            </>);
      }
  }

  function AnnotatedField({ text, annotation }) {
    const prompt = currentPrompt.current.title;
    const effects = [...allEffects.current, {id: currentTransform, effects: currentEffects.current}];
    const examples = {pos: [...allExamples.current.pos, ...posExamples], neg: [...allExamples.current.neg, ...negExamples]};
    var label = undefined, operator = undefined;
    if (showExample) {
      let result = examples.pos.find(example => example.id === text && example.prompt === prompt);
      if (result !== undefined) 
        label = "pos";
      result = examples.neg.find(example => example.id === text && example.prompt === prompt);
      if (result !== undefined) 
        label = "neg";
    }

    if (showPolicy) {
      for (const effect of effects) {
        let result = effect.effects.find(effect => effect.id === text && effect.prompt === prompt);
        if (result !== undefined)
          operator = effect.id.split('_')[1];
      }
    }
    
    return (
      <div className="annotated-underline-container">
        <span className="annotated-underline-text" 
            style={{ backgroundColor: (label === 'pos') ? 'tomato' : (label === 'neg') ? 'springgreen' : 'transparent', 
            color: label === 'pos' ? 'seashell' : 'black',
            border: operator !== undefined ? `3px solid ${colorSet[operator]}` : 'none'}}> {text} </span>
        <span className="annotated-underline-annotation"> {annotation} </span>
      </div>
    );
  }
  

  function AnnotatedText({ sentence, graph }) {
    const keywordPattern = new RegExp(graph.nodes.map(nd => nd.id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join("|"), "g");
    const segments = sentence.split(keywordPattern);
    const matchedKeywords = sentence.match(keywordPattern);
    const annotatedText = segments.reduce((acc, segment, index) => {
      if (index < segments.length - 1) {
        acc.push(segment);
        acc.push(<AnnotatedField text={matchedKeywords[index]} 
                  annotation={graph.nodes.find(nd => nd.id === matchedKeywords[index]).type.toUpperCase()}
                 />);
      } else {
        acc.push(segment);
      }
      return acc;
    }, []);
    
    return <span className="sentence" onClick={createGraph}> {annotatedText} </span>;
  }

  function AnnotationInline({ text, title }) {
    const effects = [...allEffects.current, {id: currentTransform, effects: currentEffects.current}];
    const examples = {pos: [...allExamples.current.pos, ...posExamples], neg: [...allExamples.current.neg, ...negExamples]};
    var label = undefined, operator = undefined;
    if (showExample) {
      let result = examples.pos.find(example => example.id === text && example.prompt === title);
      if (result !== undefined) 
        label = "pos";
      result = examples.neg.find(example => example.id === text && example.prompt === title);
      if (result !== undefined) 
        label = "neg";
    }
    if (showPolicy) {
      for (const effect of effects) {
        let result = effect.effects.find(effect => effect.id === text && effect.prompt === title);
        if (result !== undefined)
          operator = effect.id.split('_')[1];
      }
    }
    
    return (
        <span style={{ backgroundColor: (label === 'pos') ? 'tomato' : (label === 'neg') ? 'springgreen' : 'transparent', 
            color: label === 'pos' ? 'seashell' : 'black',
            border: operator !== undefined ? `2px solid ${colorSet[operator]}` : 'none'}}> {text} </span>
    );
  }

  function SimpleAnnotation({ text, graph, title }) {
    const keywordPattern = new RegExp(graph.nodes.map(nd => nd.id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join("|"), "g");
    const segments = text.split(keywordPattern);
    const matchedKeywords = text.match(keywordPattern);
    const annotatedText = segments.reduce((acc, segment, index) => {
      if (index < segments.length - 1) {
        acc.push(segment);
        acc.push(<AnnotationInline text={matchedKeywords[index]} title={title} />);
      } else {
        acc.push(segment);
      }
      return acc;
    }, []);
    
    return <span> {annotatedText} </span>;
  }

  const getTarget = (policy, graph) => {
    const type = policy.fields[0].label.includes('node') ? 'node' : 'edge';
    const params = {}; var result;
    for (const param of policy.fields) {
      if (param.type === "param") {
        params[param.label] = param.data;
      }
    }
    if (type === "node") {
      const targets = [];
      for (const node of graph.nodes) {
        if (params.hasOwnProperty("Entity label")) {
          result = params['Entity label'].find(entry => entry.val === node.id);
          if (result !== undefined) {
            if (result.label === "pos")
              targets.push(node.id);
            else
              continue;
          }
        }

        if (params.hasOwnProperty("Entity type")) {
          result = params['Entity type'].find(entry => entry.val === node.type);
          if (result !== undefined && result.label === "pos") {
            var posCnt = 0, negCnt = 0;
            if (params.hasOwnProperty("Relation label")) {
              const relations = edges.filter(ed => ed.source === node.id || ed.target === node.id).map(ed => ed.label);
              for (const relation of relations) {
                result = params['Relation label'].find(entry => entry.val === relation);
                if (result !== undefined) {
                  if (result.label === "pos")
                    posCnt += 1;
                  else
                    negCnt += 1;
                }
              }
              if (posCnt >= negCnt)
                targets.push(node.id);
            }
            else
              targets.push(node.id);
          }
        }
      }
      return targets;
    }
    else if (type === "edge") {
      const targets = [];
      for (const edge of graph.edges) {
        if (params.hasOwnProperty("Relation label")) {
          result = params['Relation label'].find(entry => entry.val === edge.label);
          if (result !== undefined && result.label === "pos") {
            var posCnt = 0, negCnt = 0;
            if (params.hasOwnProperty("Entity label")) {
              for (const node of [edge.source, edge.target]) {
                result = params['Entity label'].find(entry => entry.val === node);
                if (result !== undefined) {
                  if (result.label === "pos")
                    posCnt += 1;
                  else
                    negCnt += 1;
                }
              }
            }
            if (params.hasOwnProperty("Entity type")) {
              for (const node of [edge.source, edge.target]) {
                const type = graph.nodes.find(nd => nd.id === node).type;
                result = params['Entity type'].find(entry => entry.val === type);
                if (result !== undefined) {
                  if (result.label === "pos")
                    posCnt += 1;
                  else
                    negCnt += 1;
                }
              }
            }
            
            if (posCnt >= negCnt)
                targets.push(edge.id);
          }
        }
        return targets;
      }
    }
    return [];
  }

  const execute = (op) => {
    const effects = [];
    for (const prompt of userPrompts) {
      effects.push(...getTarget(op, prompt.graph).map(field => 
        ({id: field, prompt: prompt.title})
      ));
    }
    currentEffects.current = [...currentEffects.current, ...effects];
  };

  function Field({ field }) {
    if (field.type === 'text') return <span> {field.label} </span>;
    return <span> {field.label} <Select
              multiple
              value={field.data}
              input={<Input sx={{width: '100px'}}/>}
              renderValue={value => value.map((entry, idx) => 
                <span>
                  <span> {idx > 0 ? ', ' : ''} </span>
                  <span style={{color: entry.label === 'pos' ? 'tomato' : 'green'}}> {entry.val} </span>
                </span>)
              }
              onClose={(e)=>e.stopPropagation()}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: '200px',
                  },
                },
              }}
            >
              {field.data.map((entry) => (
                <ListItem
                  sx={{backgroundColor: entry.label === 'pos' ? 'tomato' : 'springgreen', 
                       color: entry.label === 'pos' ? 'seashell' : 'black'}}
                >
                  {entry.val}
                </ListItem>
              ))}
            </Select></span>;
  }

  async function generate() {
    const changeList = [];
    for (const effect of allEffects.current) {
      const operator = effect.id.split('_')[1];
      for (const transform of effect.effects) {
        if (transform.prompt === currentPrompt.current.title) {
          const category = transform.id.includes('--') ? 'edge' : 'node';
          if (category === 'node') {
            const node = currentPrompt.current.graph.nodes.find(nd => nd.id === transform.id);
            const value = await getValue(currentPrompt.current.user_id, currentPrompt.current.prompt, operator, node.id, node.id, node.type);
            changeList.push({type: 'update', id: node.id, value: value});
          }
          else if (category === 'edge') {
            const edge = currentPrompt.current.graph.edges.find(ed => ed.id === transform.id);
            const value = await getValue(currentPrompt.current.user_id, currentPrompt.current.prompt, operator, edge.id, edge.label);
            changeList.push({type: 'update', id: edge.id, value: value});
          }
        }
      }
    }

    for (const transform of currentEffects.current) {
      const operator = currentTransform.split('_')[1];
      if (transform.prompt === currentPrompt.current.title) {
        const category = transform.id.includes('--') ? 'edge' : 'node';
        if (category === 'node') {
          const node = currentPrompt.current.graph.nodes.find(nd => nd.id === transform.id);
          const value = await getValue(currentPrompt.current.user_id, currentPrompt.current.prompt, operator, node.id, node.id, node.type);
          changeList.push({type: 'update', id: node.id, value: value});
        }
        else if (category === 'edge') {
          const edge = currentPrompt.current.graph.edges.find(ed => ed.id === transform.id);
          const value = await getValue(currentPrompt.current.user_id, currentPrompt.current.prompt, operator, edge.id, edge.label);
          changeList.push({type: 'update', id: edge.id, value: value});
        }
      }
    }

    const paragraph = await generateText(currentPrompt.current.prompt, changeList);
    const revisePrompt = await revise(paragraph);

//     const changeList = [{id: '10 million units', value: '13 million units'}, {id: '+30% YoY', value: '+36% YoY'},{id: '1m or so', value: '1m or so'}, {id: '14 products', value: '19 products'} ];
//     const revisePrompt = `Please write a summary report from the meeting note below ABC Company.
// CFO meeting with ABC Company CFO John Smith
// Production outlook:
// Feasibility of 13 million units' production, +36% YoY . March production was 1m or so , already at the pace of 13m? What is the shortage situation?
// * Significant growth in all the markets.
// * Talked to suppliers and confirm the visibility of supply before making the plan.
// * In APAC region, we are slightly behind the plan, however.
// * Reallocate the chips from APAC to other markets.
// * Critical parts recovery is important. Some critical parts are still in short supply.
// * Some adjustments have been done to reduce dependency. No more single sourcing for critical parts. Parts we are using are the best/latest, but we can consider using older versions.
// * Look at the features/functions of the product. We reconfigure the specs.
// * Buy chips from brokers/open market (note: traceability is important for safety concerns. We can verify the traceability even through brokers).
// * In NA, we are ahead of the plan, but we are behind in APAC.
// * Q4 production growth rate should be over 20% YoY.
// * For demand side, we are pretty confident.
// * We have a plan to introduce 14 new products over 18 months, but we did 19 products . Except for one product, all others are selling well.
// * Despite the local voice saying not to launch a specific product variant in APAC, HQ went ahead. That was the only mistake. Used to sell 15k a month, but now only 1-2k a month.
// * We have an enhanced version in EU last month. So far, seeing good reception by the market.
// * In EU and Japan, wait time is long, from 4 months to one year.
// * US customers don't wait, if not in stores, they buy a different product. Key is to stock up inventory in the US. Usually, 3 months stock in the US, so at least 2 months in the US.`;

    const keywordPattern = new RegExp(changeList.map(change => change.value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join("|"), "g");
    const segments = revisePrompt.split(keywordPattern);
    const matchedKeywords = revisePrompt.match(keywordPattern);
    const annotatedText = segments.reduce((acc, segment, index) => {
      if (index < segments.length - 1) {
        acc.push(segment);
        acc.push(<span style={{backgroundColor: 'lightpink', color: 'grey'}}> <s> {changeList.find(change => change.value === matchedKeywords[index]).id} </s> </span> );
        acc.push(<span style={{backgroundColor: 'lightgreen', color: 'green'}}> {matchedKeywords[index]} </span>);
      } else {
        acc.push(segment);
      }
      return acc;
    }, []);
    
    setRevisePrompt(annotatedText);
    setShowChange(true);
  }

  function Suggestion({ suggestion }) {
    const onMouseOverSuggestion=(e) => {
      if (currentTransform === suggestion.id) return;

      setCurrentTransform(suggestion.id);
      currentEffects.current = [];
      execute(suggestion);

      setActiveOperator(suggestion.id.split('_')[1]);
      if (suggestion.fields[0].label.includes('node'))
        setObjectiveType("node");
      else if (suggestion.fields[0].label.includes('edge'))
        setObjectiveType("edge");
      setEdgeLabelList([]);
      setNodeLabelList([]);
      setNodeTypeList([]);

      for (const field of suggestion.fields) {
        if (field.type === "param") {
          if (field.label === "Entity type")
            setNodeTypeList(field.data);
          else if (field.label === "Entity label")
            setNodeLabelList(field.data);
          else if (field.label === "Relation label")
            setEdgeLabelList(field.data);
        }
      }
    };

    const onClickSuggestion=(e) => {
      if (activeOperator === "export") {

      }
      else {
        setRecords(records => [...records, {...suggestion, done: true}]);
        allEffects.current = [...allEffects.current, {id: suggestion.id, effects: currentEffects.current}];
        allExamples.current = {pos: [...allExamples.current.pos, ...posExamples], neg: [...allExamples.current.neg, ...negExamples]};
        setSuggestions([]);
        setPosExamples([]);
        setNegExamples([]);
      }
      setCurrentTransform("");
      setShowStatistics(false);
    }

    return (<ListItem  disablePadding
              sx={{backgroundColor: currentTransform === suggestion.id ? "aquamarine" : "white"}} >
              {/* <IconButton>
                <AssessmentOutlinedIcon onClick={(e) => setShowStatistics(true)}/> 
              </IconButton> */}
              <ListItemButton id={suggestion.id} onMouseOver={onMouseOverSuggestion} onClick={onClickSuggestion}
                sx={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                <Grid>
                  { suggestion.fields.map(field => <Field field={field} /> ) }
                </Grid>
              </ListItemButton>
            </ListItem>
            );
  }

  function Record({ record }) {
    const [expanded, setExpanded] = useState(false),
          [active, setActive] = useState(false),
          [done, setDone] = useState(record.done);
    
    const onMouseOver=(e) => {
      setActive(true);
    };

    const onMouseLeave=(e) => {
      setActive(false);
    };

    const onClickUndo=(e) => {
      setDone(false);
      record.done = false;
      allEffects.current = allEffects.current.filter(effect => effect.id !== record.id);
    }

    const onClickRedo=(e) => {
      setDone(true);
      record.done = true;
      currentEffects.current = [];
      var index = 0;
      for (const rec of records) {
        if (rec.id === record.id) break;
        if (rec.done) index += 1;
      }
      execute(record);
      allEffects.current = [...allEffects.current.slice(0, index), currentEffects.current, ...allEffects.current.slice(index, allEffects.current.length)];
      currentEffects.current = [];
    }

    const onClickDelete = (e) => {
      setRecords(records.filter(rec => rec.id !== record.id));
    };

    return (<Accordion expanded={expanded} spacing={1}>
            <AccordionSummary expandIcon={<ChevronRightOutlinedIcon onClick={(e) => setExpanded(!expanded)}/>}>
              <ListItem 
                onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} disablePadding>
                {/* <IconButton onClick={(e) => setShowStatistics(true)}>
                  <AssessmentOutlinedIcon/> 
                </IconButton> */}
                <Grid>
                  { record.fields.map(field => <Field field={field} /> ) }
                </Grid>
                { active ? 
                      done ? <IconButton>
                          <RemoveCircleIcon onClick={onClickUndo} sx={{ color: 'tomato' }}/> 
                        </IconButton> 
                      : <>
                          <IconButton>
                            <AddCircleIcon onClick={onClickRedo} sx={{ color: 'tomato' }}/> 
                          </IconButton> 
                          <IconButton>
                            <CancelIcon onClick={onClickDelete} sx={{ color: 'tomato' }}/> 
                          </IconButton> 
                        </>
                  : <></>
                }
              </ListItem>
            </AccordionSummary>
            <AccordionDetails>
            {/* <Parameter label={"Entity type"} value={
                  (() => {
                    let x = record.fields.find(field => field.label === "Entity type");
                    return x === undefined ? [] : x.val;
                  })()
                } 
                options={currentPrompt.current !== undefined ? [...new Set(currentPrompt.current.graph.nodes.map(nd => nd.type))] : []}
                addPos={option => setNodeTypeList([...nodeTypeList, {val: option, label: 'pos'}])}
                addNeg={option => setNodeTypeList([...nodeTypeList, {val: option, label: 'neg'}])} 
                remove={option => setNodeTypeList(nodeTypeList.filter(entry => entry.val !== option))}
                update={(events, values) => {if (values.length <= nodeTypeList.length) setNodeTypeList(values)}}
              />

              <Parameter label={"Entity label"} value={
                  (() => {
                    let x = record.fields.find(field => field.label === "Entity label");
                    return x === undefined ? [] : x.val;
                  })()
                } 
                options={currentPrompt.current !== undefined ? currentPrompt.current.graph.nodes.map(nd => nd.id) : []}
                addPos={option => setNodeLabelList([...nodeLabelList, {val: option, label: 'pos'}])}
                addNeg={option => setNodeLabelList([...nodeLabelList, {val: option, label: 'neg'}])} 
                remove={option => setNodeLabelList(nodeLabelList.filter(entry => entry.val !== option))}
                update={(events, values) => {if (values.length <= nodeLabelList.length) setNodeLabelList(values)}}
              />

              <Parameter label={"Relation label"} value={
                  (() => {
                    let x = record.fields.find(field => field.label === "Relation label");
                    return x === undefined ? [] : x.val;
                  })()
                } 
                options={currentPrompt.current !== undefined ? [...new Set(currentPrompt.current.graph.edges.map(ed => ed.label))] : []}
                addPos={option => setEdgeLabelList([...edgeLabelList, {val: option, label: 'pos'}])}
                addNeg={option => setEdgeLabelList([...edgeLabelList, {val: option, label: 'neg'}])} 
                remove={option => setEdgeLabelList(edgeLabelList.filter(entry => entry.val !== option))}
                update={(events, values) => {if (values.length <= edgeLabelList.length) setEdgeLabelList(values)}}
              /> */}
            </AccordionDetails>
            </Accordion>
            );
  }

  function Example({ example }) {
    const jump = (e) => {
      const prompt = userPrompts.find(prompt => prompt.title === example.prompt);
      currentPrompt.current = prompt;
      setItemList([...prompt.graph.nodes.map(nd => nd.id), ...prompt.graph.edges.map(ed => `${ed.source}--[${ed.label}]--${ed.target}`)]);
      setText(prompt.prompt.split(/(?<=[.!?]\s+|\n)/).map(sentence => <AnnotatedText sentence={sentence} graph={prompt.graph}/>));
    };
    return <span className="field" onClick={jump}> {example.id} </span>
  }

  function ExampleGroup({ examples }) {
    return <> {examples.map((example, index) =>
      <>
      <> {index > 0 && "," } </>
      <Example example={example} />
      </>
    )} </>
  }

  function Statistics() {    
    const total = currentEffects.current.length, totalPos = posExamples.length, totalNeg = negExamples.length;
    const correctPosList = [], incorrectPosList = [], correctNegList = [], incorrectNegList = [];
    var correctPosCnt = 0, correctNegCnt = 0;
    for (const pos of posExamples) {
      if (currentEffects.current.find(x => x.id === pos.id && x.prompt === pos.prompt) !== undefined) {
        correctPosCnt += 1;
        correctPosList.push(pos);
      }
      else
        incorrectPosList.push(pos);
    }
    for (const neg of negExamples) {
      if (currentEffects.current.find(x => x.id === neg.id && x.prompt === neg.prompt) === undefined) {
        correctNegCnt += 1;
        correctNegList.push(neg);
      }
      else
        incorrectNegList.push(neg);
    }
    
    const results = currentEffects.current.reduce((x, y) => {
      (x[y.prompt] = x[y.prompt] || []).push(y);
      return x;
    }, {});

    const columns = [
      { field: 'id', headerName: 'ID', type: 'number', width: 20 },
      { field: 'title', headerName: 'Title', sortable: false, width: 250 },
      { field: 'count', headerName: 'Count', type: 'number', width: 40, 
      renderCell: ({ value })=> {
        return <span style={{'&:hover': { textDecoration: 'underline' }}} 
                onClick={(e) => {
                  const prompt = userPrompts.find(prompt => prompt.title === value);
                  currentPrompt.current = prompt;
                  setItemList([...prompt.graph.nodes.map(nd => nd.id), ...prompt.graph.edges.map(ed => `${ed.source}--[${ed.label}]--${ed.target}`)]);
                  setText(prompt.prompt.split(/(?<=[.!?]\s+|\n)/).map(sentence => <AnnotatedText sentence={sentence} graph={prompt.graph}/>));
                  e.stopPropagation();
                }
                }> {value} </span>
        }}];
    
    const rows = Object.keys(results).map((key, index) => ({id: index, title: key, count: results[key].length}));

    return currentTransform !== "" ? <List>
              <div className="container">
                Policy: {
                suggestions.find(suggestion => suggestion.id === currentTransform).fields.map(field => {
                  return field.type === 'text' ? field.label
                         : <> {field.label} {field.data.map((x, index) => 
                            <>
                            <span> {index > 0 && "," } </span>
                            <span style={{color: x.label === 'pos' ? 'tomato' : 'springgreen'}}>  
                              {" " + x.val} 
                            </span>
                            </>
                           )}. </>
                })
              } 
              </div>
              <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              defaultExpanded={['1', '8']}
            >
              <TreeItem nodeId="1" label=<span>Overall sample accuracy: {((correctPosCnt + correctNegCnt)/(totalPos + totalNeg)).toFixed(6)} ({correctPosCnt + correctNegCnt}/{totalPos + totalNeg}) </span> >
                <TreeItem nodeId="2" label=<span>Positive sample accuracy: {(correctPosCnt/totalPos).toFixed(6)} ({correctPosCnt}/{totalPos})</span> >
                  <TreeItem nodeId="3" label=<span>Correct positive samples</span> >
                    <ExampleGroup examples={correctPosList} />
                  </TreeItem>
                  <TreeItem nodeId="4" label=<span>Incorrect positive samples </span> >
                    <ExampleGroup examples={incorrectPosList} />
                  </TreeItem>
                </TreeItem>
                <TreeItem nodeId="5" label=<span>Negative sample accuracy: {(correctNegCnt/totalNeg).toFixed(6)} ({correctNegCnt}/{totalNeg})</span> >
                  <TreeItem nodeId="6" label=<span>Correct negative samples: </span> >
                    <ExampleGroup examples={correctNegList} />
                  </TreeItem>
                  <TreeItem nodeId="7" label=<span>Incorrect negative samples: </span> >
                  <ExampleGroup examples={incorrectNegList} />
                  </TreeItem>
                </TreeItem>
              </TreeItem>
              <TreeItem nodeId="8" label=<span>#Covered privacy information: {total}</span> > 
              <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 4 },
                    },
                  }}
                  pageSizeOptions={[4, 5, 8, 10, 12]}
                  isRowSelectable={() => false}
                />
              </TreeItem>
            </TreeView>
          </List>
        : <></>;
  }

  function VisualizeDiff() {
    // return diffWords(currentPrompt.current.prompt, revisePrompt).map((part) => {
    //   // green for additions, red for deletions
    //   // grey for common parts
    //     const backgroundColor = part.added ? 'lightgreen' : part.removed ? 'lightpink' : 'none';
    //     const color =  part.added ? 'green' : part.removed ? 'grey' : 'black';

    //   return (<span style={{backgroundColor: backgroundColor, color: color}}> {part.removed ? <s> {part.value} </s> : part.value} </span>);
    // });
    return <span> {revisePrompt} </span>;
  }

  function Preview() {
    const effects = {};
    for (const effect of currentEffects.current) {
      if (!effects.hasOwnProperty(effect.prompt)) effects[effect.prompt] = 0;
      effects[effect.prompt] += 1;
    }
    const prompts = Object.entries(effects).sort((a, b) => b[1] - a[1]).map(item => item[0]);

    return <Grid sx={{ margin: '5px' }} container spacing={2}>
        { prompts.map(title => userPrompts.find(prompt => prompt.title === title)).map(prompt =>
            <Grid item>
                  <Paper
                    sx={{
                      height: 300,
                      width: 250,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                      overflow: 'auto', 
                      whiteSpace: 'pre-line',
                    }}
                    onClick={(e)=>{
                      currentPrompt.current = prompt; 
                      setItemList([...prompt.graph.nodes.map(nd => nd.id), ...prompt.graph.edges.map(ed => `${ed.source}--[${ed.label}]--${ed.target}`)]);
                      setText(prompt.prompt.split(/(?<=[.!?]\s+|\n)/).map(sentence => <AnnotatedText sentence={sentence} graph={prompt.graph}/>));
                      setShowStatistics(false);
                      setShowChange(false);
                    }}
                  >
                  <div style={{maxWidth:300, overflow:'false'}}> <strong>{prompt.title}</strong>: {effects[prompt.title]} </div>
                  <SimpleAnnotation text={prompt.prompt} graph={prompt.graph} title={prompt.title} />
                  </Paper>
            </Grid>
        )}
    </Grid>;
  }

  const exportPolicy = () => {
    // Create element with <a> tag
    const link = document.createElement("a");
    const content = {'policy': records};
    
    // Create a blog object with the file content which you want to add to the file
    const file = new Blob([JSON.stringify(content, null, 2)], { type: 'text/plain' });

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = UUID + '.json';

    // Add click event to <a> tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <Tooltip title="Show prompts"><ViewSidebarOutlinedIcon /></Tooltip>
          </IconButton>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeOperator} 
                  textColor="white"
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: "white"
                      }
                    }}
                    onChange={(e, value) => setActiveOperator(value)} >
                <Tab label="spoof" value="spoof"/>
                <Tab label="noisify" value="noisify" />  
                <Tab label="flip" value="flip" />
                <Tab label="edit" value="edit" />
                {/* <Tab label="add" value="add" />
                <Tab label="delete" value="delete" /> */}
                <Tab label="export" value="export" />
              </Tabs>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton>
            <FilterAltIcon />
          </IconButton>
          <IconButton onClick={loadPrompts}>
            <Tooltip title="Load user prompts">
              <CloudUploadIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={() => setAbbrMode(!abbrMode)}>
           {abbrMode ? <Tooltip title="Unfold prompt content"><UnfoldMoreIcon /></Tooltip> 
                     : <Tooltip title="Fold prompt content"><UnfoldLessIcon /></Tooltip>}
          </IconButton>
          <IconButton onClick={handleDrawerClose}>
            {<Tooltip title="Hide prompts"><ViewSidebarOutlinedIcon /></Tooltip>}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {userPrompts.map(prompt => (
            <ListItem sx={{backgroundColor: prompt === currentPrompt.current ? 'lightgrey' : 'white' }} disablePadding>
              <ListItemButton>
              <ListItemIcon>
              <ChatBubbleOutlineIcon />
              </ListItemIcon>
                <ListItemText onClick={(e) => {
                  setShowStatistics(false);
                  setShowChange(false);
                  currentPrompt.current = prompt;
                  setItemList([...prompt.graph.nodes.map(nd => nd.id), ...prompt.graph.edges.map(ed => `${ed.source}--[${ed.label}]--${ed.target}`)]);
                  setText(prompt.prompt.split(/(?<=[.!?]\s+|\n)/).map(sentence => <AnnotatedText sentence={sentence} graph={prompt.graph}/>));
                }} style={{maxHeight: '100px', overflow: 'auto', whiteSpace: 'pre-line'}} >
                <SimpleAnnotation text={(abbrMode ? prompt.title : prompt.prompt)} graph={prompt.graph} title={prompt.title} />
                </ListItemText> 
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Main open={open}>
      <DrawerHeader />
      <div style={{ height: '7vh', backgroundColor: 'white', margin: 0}}>
        <ParameterList />
      </div>
      <Divider />

      {showStatistics ? <Preview /> :
      <List>
      <center>
      <ListItem style={{ width: '38vw', margin: '5px'}} disablePadding> 
        <IconButton edge='start' onClick={() => setOpenAnnotation(!openAnnotation)}> 
          <GradingIcon/> 
        </IconButton>
        <ListItemText align='right'>
          <Switch checked={showExample} onChange={(e)=>setShowExample(e.target.checked)}/> Show Examples 
        </ListItemText>
        <ListItemText align='right'>
          <Switch checked={showPolicy} onChange={(e)=>setShowPolicy(e.target.checked)}/> Show Policy Effects 
        </ListItemText>
        <ListItemText align='right'>
          <Switch checked={showChange} onChange={async(e)=>{if (e.target.checked) generate(); else setShowChange(false); }}/> Show Changes 
        </ListItemText>
      </ListItem>

      <Card sx={{ width: '40vw', height: 'auto', minHeight: '20vh', maxHeight: '40vh', overflow: 'auto', whiteSpace: 'pre-line'}} align='left' >
      <CardContent sx={{ lineHeight: '2.5', whiteSpace: 'pre-line'}}>
          {showChange ? <VisualizeDiff /> : text}
      </CardContent>
      </Card>

      {openAnnotation ?
        <div style={{ width: '40vw', height: '30vh', margin: '40px'}}> 
        <Autocomplete sx={{ m: 1}}
            multiple
            options={itemList}
            groupBy={(option) => option.includes('--') ? 'relation' : 'entity'}
            getOptionLabel={(option) => option}
            value={posExamples}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.id} {...getTagProps({ index })} style={{backgroundColor: 'tomato', color: 'seashell'}} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Positive samples" />
            )}
            onChange={(events, values)=> {if (!posExamples.includes({id: value, prompt: currentPrompt.current.title}))setPosExamples(values.map(value => typeof value === 'string' ? ({id: value, prompt: currentPrompt.current.title}) : value))}}
            componentsProps={{
              popper: {
                modifiers: [
                  {
                    name: 'flip',
                    enabled: false
                  },
                  {
                     name: 'preventOverflow',
                     enabled: false
                   }
                ]
              }
            }}
          />

          <Autocomplete sx={{ m: 1 }}
            multiple
            options={itemList}
            groupBy={(option) => option.includes('--') ? 'relation' : 'entity'}
            getOptionLabel={(option) => option}
            value={negExamples}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.id} {...getTagProps({ index })} style={{backgroundColor: 'springgreen'}} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Negative samples" />
            )}
            onChange={(events, values)=> setNegExamples(values.map(value => typeof value === 'string' ? ({id: value, prompt: currentPrompt.current.title}) : value))}
            componentsProps={{
              popper: {
                modifiers: [
                  {
                    name: 'flip',
                    enabled: false
                  },
                  {
                     name: 'preventOverflow',
                     enabled: false
                   }
                ]
              }
            }}
          /> 
          </div>
        :
        <div style={{ width: '45vw', height: '30vh', margin: '20px'}}>
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onContextMenu}
          onEdgeClick={onContextMenu}
          fitView
        >
          <Background></Background>
          {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
          <Controls></Controls>
        </ReactFlow>
        </div>
      }
      </center>
      </List>
      }
      </Main>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="right"
        name="abc"
      >
        <div style={{ height: "400px"}}>
        <Box style={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', height: "63px", fontSize: 'large', margin: 0}}>
          <List>
            <ListItem>
            <ListItem> Policies </ListItem>
            <IconButton edge="end"> 
              {/* <VisibilityIcon style={{color: "white"}}/> */}
              <Tooltip title="Export policies"><FileDownloadIcon style={{color: "white"}} onClick={exportPolicy}/></Tooltip>
            </IconButton>
            </ListItem>
          </List>
        </Box>
        {/* <Toolbar /> */}

        <List sx={{height: "340px", overflow: 'auto'}}>
          {records.map((record) => (
            <Record record={record} />
          ))}
        </List>
        </div>

        <Divider />
        <div style={{ height: "350px"}}>
        <Box style={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', height: "63px", fontSize: 'large'}}>
          <List><ListItem><ListItem>Suggestions</ListItem>
          <IconButton edge="end">
            <Tooltip title="Preview policy effects"><AssessmentOutlinedIcon style={{color: "white"}} onClick={(e) => setShowStatistics(true)}/> </Tooltip>
          </IconButton> 
          </ListItem>
          </List>
        </Box>
        
        <List sx={{height: "330px", overflow: 'auto'}}>
            {suggestions.map((suggestion) => 
                <Suggestion suggestion={suggestion} />)}
          </List>
        
        </div>
      </Drawer>
    </Box>
  );
}
