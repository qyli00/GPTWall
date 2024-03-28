import { useCallback, useState} from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { top: '12px' };

function TextUpdaterNode({ id, data, isConnectable }) {
  const [onEdit, setOnEdit] = useState(false);

  const onClick = ((e) => {
    if (e.detail == 2)
      setOnEdit(true);
  });

  const onBlur = ((e) => {
    setOnEdit(false);
  });

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} style={handleStyle} isConnectable={isConnectable} />
      <div>
        { onEdit ? <input id={id} name={id} onBlur={onBlur} defaultValue={data.label} style={{ backgroundColor: data.color }} /> 
                    : <div name={id} onClick={onClick} style={{border: '1px solid black', 'borderRadius': "5px", backgroundColor: data.color }}> {data.label} </div> }
      </div>
      <label> Type: {data.type} </label>
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle} 
        isConnectable={isConnectable}
      />
      {/* <Handle type="source" position={Position.Right} id="b" isConnectable={isConnectable} /> */}
    </div>
  );
}

export default TextUpdaterNode;
