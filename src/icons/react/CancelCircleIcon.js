
import * as React from 'react';

const CancelCircleIcon = React.forwardRef(({ title, titleId, ...props }, ref) => (
  <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.4805 16.48C16.3345 16.626 16.1425 16.7 15.9505 16.7C15.7575 16.7 15.5665 16.626 15.4195 16.48L7.51949 8.581C7.22649 8.288 7.22649 7.813 7.51949 7.52C7.81249 7.227 8.28749 7.227 8.58049 7.52L16.4805 15.419C16.7735 15.712 16.7735 16.187 16.4805 16.48ZM12.0005 3C7.03749 3 3.00049 7.037 3.00049 12C3.00049 16.962 7.03749 21 12.0005 21C16.9625 21 21.0005 16.962 21.0005 12C21.0005 7.037 16.9625 3 12.0005 3Z" fill="black" fill-opacity="0.56"/>
</svg>

));

export default CancelCircleIcon;
    