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
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAll';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Switch from '@mui/material/Switch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GradingIcon from '@mui/icons-material/Grading';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ReviewsIcon from '@mui/icons-material/Reviews';
import UpdateIcon from '@mui/icons-material/Update';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import InputLabel from "@mui/material/InputLabel";
import Input from '@mui/material/Input';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Checkbox from '@mui/material/Checkbox';

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
import { DataGrid, 
  GridToolbar, 
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridLogicOperator
} from '@mui/x-data-grid';

import Tooltip from '@mui/material/Tooltip';
import FormatClearIcon from '@mui/icons-material/FormatClear';

import { ListItemAvatar, Avatar } from '@mui/material';

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
import { CancelOutlined, HighlightOffOutlined, HighlightOffTwoTone, RemoveCircle } from "@mui/icons-material";
import debounce from 'lodash/debounce';

const nodeTypes = { textUpdaterNode: TextUpdaterNode}; 
const edgeTypes = { textUpdaterEdge: TextUpdaterEdge};

const drawerWidth = 400;
const UUID = crypto.randomUUID();

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

  const [userPrompts, setUserPrompts] = useState([]);
  const [revisePrompt, setRevisePrompt] = useState("");
  const currentPrompt = useRef();
  const allExamples = useRef({pos: [], neg: []});
  const allEffects = useRef([]);
  const currentEffects = useRef([]);

  const [text, setText] = useState("");
  const [mode, setMode] = useState("whitelist");
  const posExamples = useRef([]);
  const negExamples = useRef([]);

  const [currentTransform, setCurrentTransform] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [records, setRecords] = useState([]);

  const [objectiveType, setObjectiveType] = useState("");
  const [nodeCategory, setNodeCategory] = useState("All");
  const [nodeTypeList, setNodeTypeList] = useState([]);
  const [nodeLabelList, setNodeLabelList] = useState([]);
  const [edgeLabelList, setEdgeLabelList] = useState([]);

  const [showChange, setShowChange] = useState(false);
  const [localView, setLocalView] = useState(false);
  const [preview, setPreview] = useState(false);

  const ref = useRef(null);

  const loadPrompts = async() => {
    // fetch('./sample/userPrompts.json')
    fetch('./sample/eval_dataset.json')
    .then(response => response.text())
     .then(text => {
        setUserPrompts(JSON.parse(text));
    });
  };

  const execute = () => {
    
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
  
  function Field({ field }) {
    const [value, setValue] = useState(field), 
          [onEdit, setOnEdit] = useState(false);

    const handleClick= (e) => {
      // setOnEdit(true);
    };

    const handleChange= (e, data) => {
      field.value = data.value;
      setValue(data.value);
    }

    const handleClose= (e) => {
      setOnEdit(false);
    };

    if (field.type === 'text') return <span> {field.label} </span>;
    else if (field.type === 'type') {
      return onEdit ? <></> : <span className="field" onClick={handleClick}>{field.label}</span>;
    }
    else if (field.type.includes('label')) {
      if (field.data.length == 0) return <></>;
      return onEdit ? <></> : 
            <span>{field.type.includes('neg') ? ' except' : ''}
            <span className="field" onClick={handleClick}>
              {field.data.map((entry, idx) => 
                <span>
                  {idx > 0 ? ',' : ''}
                  <span style={{color: field.type.includes('pos') ? 'tomato' : 'green'}}> {entry.val} </span>
                </span>)
              }
            </span>
            </span>;
    }
    return <></>;
    // return (<>
    //         {field.data.map((entry, idx) => 
    //         <span>
    //           {idx > 0 ? ',' : ''}
    //           <span style={{color: entry.label === 'pos' ? 'tomato' : 'green'}}> {entry.val} </span>
    //         </span>)
    //         }
    //         <span> {field.label} </span>
    //         </>
    //       );
    // return <span> {field.label} <Select
    //           multiple
    //           value={field.data}
    //           input={<Input sx={{width: '100px'}}/>}
    //           renderValue={value => value.map((entry, idx) => 
    //             <span>
    //               <span> {idx > 0 ? ', ' : ''} </span>
    //               <span style={{color: entry.label === 'pos' ? 'tomato' : 'green'}}> {entry.val} </span>
    //             </span>)
    //           }
    //           onClose={(e)=>e.stopPropagation()}
    //           MenuProps={{
    //             PaperProps: {
    //               style: {
    //                 maxHeight: '200px',
    //               },
    //             },
    //           }}
    //         >
    //           {field.data.map((entry) => (
    //             <ListItem
    //               sx={{backgroundColor: entry.label === 'pos' ? 'tomato' : 'springgreen', 
    //                    color: entry.label === 'pos' ? 'seashell' : 'black'}}
    //             >
    //               {entry.val}
    //             </ListItem>
    //           ))}
    //         </Select></span>;
  }

  function Suggestion({ suggestion }) {
    const onMouseOverSuggestion=(e) => {
      if (currentTransform === suggestion.id) return;
      setCurrentTransform(suggestion.id);

      execute(suggestion);
      // if (suggestion.fields[0].label.includes('node'))
      //   setObjectiveType("node");
      // else if (suggestion.fields[0].label.includes('edge'))
      //   setObjectiveType("edge");
      // setEdgeLabelList([]);
      // setNodeLabelList([]);
      // setNodeTypeList([]);

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
      setLocalView(false); setPreview(true);
    }

    return (<ListItem  disablePadding
              sx={{backgroundColor: currentTransform === suggestion.id ? "#B3E5FC" : "white"}} >
              <ListItemButton id={suggestion.id} onMouseOver={onMouseOverSuggestion} onClick={onClickSuggestion}
                sx={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                <Grid style={{padding:4}}>
                  {method == 'Method' ? '' : method} { suggestion.fields.map(field => <Field field={field} /> ) }
                </Grid>
              </ListItemButton>
            </ListItem>
            );
  }

  function Record({ record }) {
    const [expanded, setExpanded] = useState(false),
          [active, setActive] = useState(false),
          [done, setDone] = useState(record.done),
          [purpose, setPurpose] = useState("");
    
    const [recMethod, setRecMethod] = useState(record.method),
          [recParam, setRecParam] = useState(record.param),
          [recMode, setRecMode] = useState(record.mode),
          [recContext, setRecContext] = useState(record.context);

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

    const onClickEdit = (e) => {
      setSuggestions([{id: Date.now(), fields: record.fields}]);
      setMethod(recMethod);
      setValue(recParam);
      setContext(recContext);
      posExamples.current = record.examples.pos;
      negExamples.current = record.examples.neg;
      setRecords(records.filter(rec => rec.id !== record.id));
    };

    return (<Accordion expanded={expanded} spacing={1}>
            <AccordionSummary expandIcon={<ChevronRightOutlinedIcon onClick={(e) => setExpanded(!expanded)}/>}>
              <div
                onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} disablePadding style={{margin: 2}}>
                {recMethod}
                <b  style={{color: 'royalblue'}}> {record.fields.find(field => field.type === 'type').label} </b>
                information
                {recParam !== undefined && recMethod !== 'anonymize' ? <><span> with {recMethod === 'noisify' ? 'noise range of ' : ''} </span> <b  style={{color: 'royalblue'}}> {recParam}</b></> : <></>}
                {purpose === '' ? '' : ' to '}
                <u>{purpose}</u>

                { active ? 
                      done ? <><IconButton>
                              <RemoveCircleIcon onClick={onClickUndo} sx={{ color: 'tomato' }}/> 
                              </IconButton> 
                              <IconButton>
                              <EditIcon onClick={onClickEdit} sx={{ color: 'tomato' }}/> 
                              </IconButton>
                            </>
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
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={0.5}>
                <Grid item xs={4} sx={{ textAlign: 'right'}}>method:</Grid>
                <Grid item xs={8} sx={{height: '40px', margin: 0, padding: 0}}>
                  <Select style={{ height: '50%'}}
                    value={recMethod}
                    size="small"
                    onChange={(e)=>{setRecMethod(e.target.value); record.method = e.target.value;} }
                  >
                  <MenuItem value={"replace"}>replace</MenuItem>
                  <MenuItem value={"noisify"}>noisify</MenuItem>
                  <MenuItem value={"mask"}>mask</MenuItem>
                  <MenuItem value={"fuzzy"}>fuzzy</MenuItem>
                  <MenuItem value={"anonymize"}>anonymize</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>information type:</Grid>
                <Grid item xs={8}>{ record.fields.map(field => <Field field={field} /> ) }</Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>context:</Grid>
                <Grid item xs={8}>{recContext.length === 0  ? 'All' : recMode === 'whitelist' ? <span>except</span> : <>when</>} <span style={{color: recMode === 'whitelist' ? 'green' : 'tomato'}}> {recContext.join(', ')} </span> </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>purpose:</Grid>
                <Grid item xs={8}><input style={{border: 'none', fontSize: 16, width: '250px'}} value={purpose} onChange={(e)=>setPurpose(e.target.value)}/></Grid>
              </Grid>
            </AccordionDetails>
            </Accordion>
            );
  }
 
  const getTarget = (graph, policy) => {
    if (policy == undefined) return [];
    const targets = [], params = {};
    for (const node of graph.nodes) {
      var param = policy.fields.find(param => param.type == "label_pos");
      if (param !== undefined) {
        console.log(param);
        var result = param.data.find(entry => entry.val === node.id);
        if (result !== undefined) {
            targets.push(node.id);
            continue;
        } 
      }

      param = policy.fields.find(param => param.type == "label_neg");
      if (param !== undefined) {
        result = param.data.find(entry => entry.val === node.id);
        if (result !== undefined) continue; 
      }
  
      for (const param of policy.fields) {
        if (param.type == "type") {
          params[param.label] = param.data;
        }
      }
      for (const [key, value] of Object.entries(params)) {
        var result = value.find(entry => entry.val === node.type);
        if (result !== undefined && result.label === "pos") {
          targets.push(node.id);
        }
      }
    }
    return targets;
  }

  function VisualizeDiff() {
    return diffWords(currentPrompt.current.prompt, revisePrompt).map((part) => {
      // green for additions, red for deletions
      // grey for common parts
        const backgroundColor = part.added ? 'lightgreen' : part.removed ? 'lightpink' : 'none';
        const color =  part.added ? 'green' : part.removed ? 'grey' : 'black';

      return (<span style={{backgroundColor: backgroundColor, color: color}}> {part.removed ? <s> {part.value} </s> : part.value} </span>);
    });
  }

  const [previewPaginationModel, setPreviewPaginationModel] = React.useState({
    pageSize: 50,
    page: 0,
  });

  function Preview() {
    const rows = userPrompts.flatMap(prompt => 
        getTarget(prompt.graph, suggestions.find(suggestion => suggestion.id === currentTransform))
        .map(field => ({id: prompt.id+field, title: prompt.title, prompt: {text: prompt.prompt, field: field}, context: prompt.context})));

      const RenderLabel = (params) => {
        const currentLabel = posExamples.current.find(pos => pos.id == params.row.prompt.field && pos.prompt === params.row.title) ? 'Pos' : negExamples.current.find(neg => neg.id == params.row.prompt.field && neg.prompt === params.row.title) ? 'Neg' : '';
        const [label, setLabel] = useState(currentLabel);
        const handleChange = (event) => {
          const val = event.target.value;
          setLabel(val);
          if (val == '') {
            posExamples.current = posExamples.current.filter(x => x.id !== params.row.prompt.field || params.row.title !== x.prompt);
            negExamples.current = negExamples.current.filter(x => x.id !== params.row.prompt.field || params.row.title !== x.prompt);
          }
          else if (val == 'Pos') {
            const example = {prompt: params.row.title, id: params.row.prompt.field};
            if (!posExamples.current.find(pos => pos.prompt == example.prompt && pos.id == example.id))
              posExamples.current = [example, ...posExamples.current];
            negExamples.current = negExamples.current.filter(x => x.id !== params.row.prompt.field || params.row.title !== x.prompt);
          }
          else if (val == 'Neg') {
            const example = {prompt: params.row.title, id: params.row.prompt.field};
            if (!negExamples.current.find(neg => neg.prompt == example.prompt && neg.id == example.id))
              negExamples.current = [example, ...negExamples.current];
            posExamples.current = posExamples.current.filter(x => x.id !== params.row.prompt.field || params.row.title !== x.prompt);
          }
        };
      
        return (
          <FormControl sx={{ m: 1, minWidth: 160, border: 'none' }} size="small">
            <Select
              value={label}
              onChange={handleChange}
              sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
            >
              <MenuItem value="">
                None
              </MenuItem>
              <MenuItem value={'Pos'}><strong style={{color: 'tomato'}}>Sensitive</strong></MenuItem>
              <MenuItem value={'Neg'}><strong style={{color: 'limegreen'}}>Non-sensitive</strong></MenuItem>
            </Select>
          </FormControl>
        );
      };
        
    const columns = [
      {
        field: 'title',
        headerName: 'Title',
        width: 250,
      },
      {
        field: 'prompt',
        headerName: 'Text',
        width: 800,
        renderCell: (value) => {
          let text = value.row.prompt.text, field = value.row.prompt.field;
          // const regex = new RegExp(field, 'gi');
          // let match = regex.exec(text);
          // const index = match.index; 
          // text = text.replace(regex, `<span style={{border: '2px solid brown'}}>${field}</span>`);
          const index = text.toLowerCase().indexOf(field.toLowerCase());
          if (index == -1) 
            return <div style={{overflowX: 'auto' }}>
                    <span>{text}</span> 
                  </div>;
          const start = Math.max(index - 40, 0);
          const end = Math.min(index + field.length + 100, text.length);
          const prefix = start > 0 ? '...' : '';
          const suffix = end < text.length ? '...' : '';
          const highlighted = (
            // <span style={{ backgroundColor: 'tomato', color: 'seashell'}}>
            <span style={{ border: '2px solid brown'}}>
              {text.substring(index, index + field.length)}
            </span>
          );
          return (
            <div style={{overflowX: 'auto' }}>
            <span>
              {prefix}
              {text.substring(start, index)}
              {highlighted}
              {text.substring(index + field.length, end)}
              {suffix}
            </span>
            </div>
          );
        }
      },
      {
        field: 'label',
        headerName: 'Label',
        width: 180,
        renderCell: RenderLabel
      }
    ];

    const handleRowClick = (params)=> {
      setLocalView(true);
      const title = params.row.title;
      let body = params.row.prompt.text; 
      return renderText(title, body, params.row.context);
    }
  
    return (
      <div>
        <Box sx={{marginTop: '37px', height: 780, width: 1280, position: 'relative' }}>
          {localView ?
            <IconButton onClick={()=>setLocalView(false)} color="inherit">
            <Tooltip title="Back">
              <ArrowBackIcon />
            </Tooltip>
            </IconButton>
            : 
            <IconButton onClick={()=>setPreview(false)} color="inherit">
            <Tooltip title="Back">
              <ArrowBackIcon />
            </Tooltip>
            </IconButton>
          }
         <DataGrid
            slots={{
              columnHeaders: () => null,
            }}
            rows={rows}
            columns={columns}
            onRowClick={handleRowClick}
            paginationModel={previewPaginationModel}
            onPaginationModelChange={setPreviewPaginationModel}
            pageSizeOptions={[10, 20, 50]}
            checkboxSelection
            // disableRowSelectionOnClick
          />
        </Box>
      </div>
    );
  }

const [paginationModel, setPaginationModel] = useState({
  pageSize: 50,
  page: 0
});

const [filterModel, setFilterModel] = useState({
  items: [],
  quickFilterExcludeHiddenColumns: false,
});

function renderText(title, body, context) {
  posExamples.current.forEach(positiveSnippet => {
    if (positiveSnippet.prompt === title) {
      const regex = new RegExp(positiveSnippet.id, 'gi');
      body = body.replace(regex, `<span class="Positive">${positiveSnippet.id}</span>`);
    }
  });

  negExamples.current.forEach(negativeSnippet => {
    if (negativeSnippet.prompt === title) {
      const regex = new RegExp(negativeSnippet.id, 'gi');
      body = body.replace(regex, `<span class="Negative">${negativeSnippet.id}</span>`);
    }
  });

  const graph = userPrompts.find(prompt => prompt.title === title).graph;
  
  records.forEach(record => {
    if (record.done) {
      const filterNodes = getTarget(graph, record);
      new Set(filterNodes).forEach(nd => {
        const regex = new RegExp(nd, 'gi');
        body = body.replace(regex, `<span class="Effect">${nd}</span>`);
      });
    }
  });

  const filterNodes = getTarget(graph, suggestions.find(suggestion => suggestion.id === currentTransform));
  new Set(filterNodes).forEach(nd => {
    const regex = new RegExp(nd, 'gi');
    body = body.replace(regex, `<span class="Predict">${nd}</span>`);
  });

  currentPrompt.current = title;
  setText(<div>
          <h2 style={{ display: 'inline'}}>{title} </h2> 
          <Autocomplete
          multiple
          id="tags"
          options={[...new Set(userPrompts.map(prompt => prompt.context))]}
          defaultValue={[context]}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip size="small" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
            />
          )}
          sx={{
            'display': 'inline-block',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            "& .MuiOutlinedInput-root": {
              // border: "1px solid yellow",
              borderRadius: "0",
              padding: "0"
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                border: "none"
            }
          }}
        /> 
        {React.createElement('p', { dangerouslySetInnerHTML: { __html: body } })}
        </div>);
}

function ParameterList() {
  const handleParamterChange = ()=>{
    if (objectiveType !== '' && (nodeTypeList.length > 0 || nodeLabelList.length > 0 || edgeLabelList.length > 0)) {
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
        const suggestion = {id: Date.now(), fields: params};
        setSuggestions([suggestion]);
        setCurrentTransform(suggestion.id);
        execute(suggestion);
      }
      else {
        setSuggestions([]);
      }
    };

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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Button onClick={loadPrompts} startIcon={<Tooltip title="Load user prompts">
          <CloudUploadIcon/>
        </Tooltip>}
        color="primary">
        Load
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <Box sx={{ flexGrow: 1 }} />
      {/* <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      /> */}
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

function QueryInput(props) {
  const { item, applyValue, focusElementRef } = props;

  const handleFilterChange = debounce((e) => {
    applyValue({ ...item, value: e.target.value });
  }, 500);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
      <TextField
        defaultValue={item.value}
        onChange={handleFilterChange}
      />
    </Box>
  );
}


function PromptList() {
  const containsAnyOperator = [
    {
      label: 'Contains Any',
      value: 'containsAny',
      getApplyFilterFn: (filterItem) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }
      
        return (value) => {
          const filterValues = filterItem.value.split('|').map(val => val.trim().toLowerCase());
          return filterValues.some(filterValue =>
            value.row.content.toString().toLowerCase().includes(filterValue)
          );
        };
      },      
      InputComponent: QueryInput,
    },
  ];  

  const columns = [
    { field: 'user', headerName: 'User', width: 200},
    {field: 'context', headerName: 'Context', width: 200, hide: true},
    {
      field: 'content',
      headerName: 'Content',
      width: 850,
      renderCell: (value) => {
        const [title, body] = value.row.content.split(' - '); 
        return (<div style={{overflow: 'auto'}}><span>{title}</span>&nbsp; <span style={{color: 'gray'}}> - {body} </span></div>);
      },
      filterOperators: containsAnyOperator
    },
    {
      field: 'timestamp',
      headerName: 'Time',
      width: 300,
    }
  ];

  const rows = userPrompts.map(prompt =>({id: prompt.id, user: prompt.user, context: prompt.context, 
    timestamp: prompt.timestamp, content: prompt.title + ' - ' + prompt.prompt }));

  const handleRowClick = (params)=> {
    setLocalView(true);
    let [title, ...rest] = params.row.content.split(' - ');
    let body = rest.join(' - ');
    return renderText(title, body, params.row.context);
  }


  return (
    <div>
      <Box sx={{height: 850, width: 1280, position: 'relative' }}>
      <DataGrid columnHeaderHeight={35}
          // disableColumnFilter
          // disableColumnSelector
          disableDensitySelector
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          slots={{ toolbar: CustomToolbar}}
          // slotProps={{
          //   toolbar: {
          //     csvOptions: { disableToolbarButton: true },
          //     printOptions: { disableToolbarButton: true },
          //     showQuickFilter: true,
          //   },
          // }}  
          initialState={{
            columns: {
              columnVisibilityModel: {
                context: false,
              },
            },        
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={(val) => setPaginationModel(val)}
          filterModel={filterModel}
          onFilterModelChange={debounce((val) => setFilterModel(val), 400)}
          pageSizeOptions={[10, 20, 50]}
          checkboxSelection
          // disableRowSelectionOnClick
        />
      </Box>
    </div>
    );
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

  const [selectionRange, setSelectionRange] = useState(null);
  const [selectionText, setSelectionText] = useState();

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const textContent = selection.toString();
    if (textContent) {
      setSelectionText(textContent.trim());
      setSelectionRange(selection.getRangeAt(0));
    } else {
      setSelectionRange(null);
    }
  };

  const handlePositive = () => {
    if (selectionRange) {
      const span = document.createElement('span');
      span.className = 'Positive';
      span.appendChild(selectionRange.extractContents());
      selectionRange.insertNode(span);
      const example = {prompt: currentPrompt.current, id: selectionText};
      if (!posExamples.current.find(pos => pos.prompt == example.prompt && pos.id == example.id))
        posExamples.current = [example, ...posExamples.current];
      negExamples.current = negExamples.current.filter(x => x.id !== selectionText || currentPrompt.current !== x.prompt);
      const paramsList = snowball(userPrompts, posExamples.current, negExamples.current, suggestions.find(suggestion => suggestion.id == currentTransform));
      setSuggestions(paramsList.map((params, i) => ({id: Date.now() + i, fields: params})));
    }
  };

  const handleNegative = () => {
    if (selectionRange) {
      const span = document.createElement('span');
      span.className = 'Negative';
      span.appendChild(selectionRange.extractContents());
      selectionRange.insertNode(span);
      const example = {prompt: currentPrompt.current, id: selectionText};
      if (!negExamples.current.find(neg => neg.prompt == example.prompt && neg.id == example.id))
        negExamples.current = [example, ...negExamples.current];
      posExamples.current = posExamples.current.filter(x => x.id !== selectionText || currentPrompt.current !== x.prompt);
      const paramsList = snowball(userPrompts, posExamples.current, negExamples.current, suggestions.find(suggestion => suggestion.id == currentTransform));
      setSuggestions(paramsList.map((params, i) => ({id: Date.now() + i, fields: params})));
    }
  };

  const handleClear = () => {
    if (selectionRange) {
      const span = document.createElement('span');
      span.className = 'Normal';
      span.appendChild(selectionRange.extractContents());
      selectionRange.insertNode(span);
      posExamples.current = posExamples.current.filter(x => x.id !== selectionText || currentPrompt.current !== x.prompt);
      negExamples.current = negExamples.current.filter(x => x.id !== selectionText || currentPrompt.current !== x.prompt);
      const paramsList = snowball(userPrompts, posExamples.current, negExamples.current, suggestions.find(suggestion => suggestion.id == currentTransform));
      setSuggestions(paramsList.map((params, i) => ({id: Date.now() + i, fields: params})));
    }
  };

  const [method, setMethod] = useState('Method');

  const handleChange = (event) => {
    setMethod(event.target.value);
  };

  const [value, setValue] = useState();
  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  const [context, setContext] = React.useState([]);
  const handleContext = (event) => {
    const {
      target: { value },
    } = event;
    setContext(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setMethod(e.target.innerText);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* <AppBar><Toolbar></Toolbar></AppBar> */}
      {/* <AppBar position="fixed">
        <Toolbar>
          { 
          localView ?
          <IconButton onClick={()=>setLocalView(false)} color="inherit">
          <Tooltip title="Back">
            <ArrowBackIcon />
          </Tooltip>
          </IconButton>
          : preview ?
          <IconButton onClick={()=>setPreview(false)} color="inherit">
          <Tooltip title="Back">
            <ArrowBackIcon />
          </Tooltip>
          </IconButton> :
           <IconButton onClick={loadPrompts} color="inherit">
            <Tooltip title="Load user prompts">
              <CloudUploadIcon />
            </Tooltip>
            </IconButton>
          }

           <FormControl required variant="outlined" sx={{ m: 1, minWidth: 120}}>
                  <InputLabel variant="outlined" sx={{color: "white" }}>Method</InputLabel>
                  <Select 
                    value={method}
                    onChange={handleChange}
                    label="Method"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white',
                        },
                        '&:hover fieldset': {
                          borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                      color: "white"
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"replace"}>Replace</MenuItem>
                    <MenuItem value={"noisify"}>Noisify</MenuItem>
                    <MenuItem value={"mask"}>Mask</MenuItem>
                    <MenuItem value={"fuzzy"}>Fuzzy</MenuItem>
                    <MenuItem value={"anonymize"}>Anonymize</MenuItem>
                  </Select>
                </FormControl>
                
                {method === 'noisify' ? 
                  <TextField
                    label='Noise range'
                    type="number"
                    value={value}
                    onChange={handleValueChange}
                    InputLabelProps={{
                      style: { color: 'white'}
                    }}
                    inputProps={{                    
                      step: 0.1, // Set the step size to allow decimals
                      min: 0,     // Minimum value
                      max: 1,      // Maximum valu
                      style: { color: 'white', width: 120}
                    }}
                    style={{borderColor: 'white'}}
                  />
                  :
                  method === 'replace' ? 
                    <TextField label='Replacement value' 
                    value={value}
                    onChange={handleValueChange}
                    InputLabelProps={{
                      style: { color: 'white'}
                    }}
                    inputProps={{                    
                      style: { color: 'white', width: 120}
                    }}
                  /> :
                  method === 'mask' ? 
                    <TextField label='Mask char' 
                    value={value}
                    onChange={handleValueChange}
                    InputLabelProps={{
                      style: { color: 'white'}
                    }}
                    inputProps={{                    
                      style: { color: 'white', width: 60}
                    }}
                  /> :
                    <></>
                }

                <FormControl variant="outlined" sx={{ m: 1, width: 120}}>
                  <InputLabel variant="outlined" sx={{color: "white" }}>Mode</InputLabel>
                  <Select
                      value={mode}
                      onChange={(event)=>setMode(event.target.value)}
                      variant="outlined"
                      sx={{
                        color: "white"
                      }}
                  >
                    <MenuItem value={'whitelist'}>Whitelist</MenuItem>
                    <MenuItem value={'blacklist'}>Blacklist</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="outlined" sx={{ m: 1, width: 300}}>
                  <InputLabel variant="outlined" sx={{color: "white" }}>Context</InputLabel>
                  <Select
                    multiple
                    value={context}
                    onChange={handleContext}
                    renderValue={(selected) => selected.join(', ')}
                    sx={{
                      color: "white"
                    }}
                  >
                    {[...new Set(userPrompts.map(prompt => prompt.context))].map((key) => (
                      <MenuItem key={key} value={key}>
                        <Checkbox checked={context.indexOf(key) > -1} />
                        <ListItemText primary={key} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

          <Button variant="Outlined" align='right' onClick={()=> {
            if (currentTransform === "") return;
            setRecords(records => [{id: Date.now(), fields: suggestions.find(suggestion => suggestion.id === currentTransform).fields, method: method, param: value, context: context, mode: mode, done: true, examples: {'pos': posExamples.current, 'neg': negExamples.current}}, ...records]);
            setCurrentTransform("");
            setSuggestions([]);
            setMethod('Method');
            setValue();
            setContext([]);
            setLocalView(false);
            setPreview(false);
            posExamples.current = [];
            negExamples.current = [];
          }}>
            <span style={{ textTransform: 'none', fontSize: 16  }}>
            Generate Policy
            </span>
            </Button>
          </Toolbar> 
      </AppBar>*/}
      
      {/* <Main open={open}> */}
      {/* <DrawerHeader sx={{height: '0px'}} /> */}
      {/* <Divider /> */}
      {/* <center> <ParameterList /></center> */}

      { localView ? 
      <center>
        <ListItem style={{ width: '38vw', marginLeft: '20px', marginTop: 30}} disablePadding>
          <IconButton edge='start' onClick={() => setLocalView(false)}> 
            <ArrowBackIcon/> 
          </IconButton>
          <ListItemText align='right'>
          <IconButton onClick={handlePositive}> 
            <BlockIcon style={{color: 'tomato'}}/> 
          </IconButton>
          Mark as Sensitive
          </ListItemText>
          <ListItemText align='right'>
          <IconButton onClick={handleNegative}> 
            <CheckCircleOutlineIcon style={{color: 'limegreen'}}/> 
          </IconButton>
          Mark as Non-sensitive
          </ListItemText>
          <ListItemText align='right'>
          <IconButton onClick={handleClear}> 
            <FormatClearIcon/> 
          </IconButton>
          Clear
          </ListItemText>
        </ListItem>

        <Card sx={{marginLeft: 15, marginTop: 5, width: '60vw', height: 'auto', minHeight: '80vh', maxHeight: '80vh', overflow: 'auto', whiteSpace: 'pre-line'}} align='left' >
        
        <CardContent sx={{ lineHeight: '2.5', whiteSpace: 'pre-line'}}>
          <div onMouseUp={handleTextSelection}> {showChange ? <VisualizeDiff /> : text} </div>
          <style>
            {`
              .Positive {
                background-color: tomato;
                color: seashell;
              }
              .Negative {
                background-color: springgreen;
                color: darkgrey;
              }
              .Normal {
                background-color: white;
                color: black;
              }
              .Predict {
                border: 2px solid brown;
                color: black;
              }
              .Effect {
                border: 4px solid darkred;
                color: black;
              }
            `}
          </style>
        </CardContent>
        </Card>
      </center> : 
      preview ? <Preview /> :
      <PromptList /> }
      {/* </Main> */}

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
        <Box style={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', height: "78px", fontSize: 'large', margin: 0}}>
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

        <List sx={{height: "340px", overflow: 'auto'}}>
          {records.map((record) => (
            <Record record={record} />
          ))}
        </List>
        </div>

        <Divider />
        <div style={{ height: "350px"}}>
        <Box style={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', height: "70px", fontSize: 'large'}}>
          <List>
            <ListItem style={{ margin: 0 }}>
            <ListItem>
            <Button style={{color: 'white'}}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                Method
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem value={"replace"} onClick={handleClose} selected={"replace" == method}>replace</MenuItem>
                <MenuItem value={"noisify"} onClick={handleClose} selected={"noisify" == method}>noisify</MenuItem>
                <MenuItem value={"mask"} onClick={handleClose} selected={"mask" == method}>mask</MenuItem>
                <MenuItem value={"fuzzy"} onClick={handleClose} selected={"fuzzy" == method}>fuzzy</MenuItem>
                <MenuItem value={"anonymize"} onClick={handleClose} selected={"anonymize" == method}>anonymize</MenuItem>
              </Menu>
          </ListItem>
          <IconButton edge="end">
            <Tooltip title="Generate policy"><TaskAltIcon style={{color: "white"}} onClick={(e) => {
              if (currentTransform === "") return;
              setRecords(records => [{id: Date.now(), fields: suggestions.find(suggestion => suggestion.id === currentTransform).fields, method: method, param: value, context: context, mode: mode, done: true}, ...records]);
              setCurrentTransform("");
              setSuggestions([]);
              setValue();
              setContext([]);
              posExamples.current = [];
              negExamples.current = [];
            }}/> </Tooltip>
          </IconButton> 
          <IconButton edge="end">
            <Tooltip title="Clear policy"><CancelOutlined style={{color: "white"}} onClick={(e) => {
              posExamples.current = [];
              negExamples.current = [];
              setSuggestions([]);
              setPreview(false);
            }}/> 
            </Tooltip>
          </IconButton>
          <IconButton edge="end">
            <Tooltip title="Update policy"><PublishedWithChangesIcon style={{color: "white"}} onClick={(e) => {
              const paramsList = snowball(userPrompts, posExamples.current, negExamples.current, suggestions.find(suggestion => suggestion.id == currentTransform));
              setSuggestions(paramsList.map((params, i) => ({id: Date.now() + i, fields: params})));
            }}/> </Tooltip>
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
