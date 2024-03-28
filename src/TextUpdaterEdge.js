import { useCallback, useState } from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data
}) => {
  const onClick = ((e) => {
    if (e.detail == 2)
      setOnEdit(true);
  });

  const onBlur = ((e) => {
    setOnEdit(false);
  });

  const [onEdit, setOnEdit] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        
        <div className='text-updater-edge'
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all'
          }}
        >
          { onEdit ? <input id={id} name={id} onBlur={onBlur} defaultValue={data.label} style={{backgroundColor: data.color}} /> 
                   : <span name={id} onClick={onClick} style={{backgroundColor: data.color}}> {data.label} </span> }
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
