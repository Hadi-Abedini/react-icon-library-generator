
import * as React from 'react';

const BookmarkedIcon = React.forwardRef(({ title, titleId, ...props }, ref) => (
  <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.001 3H7.99902C6.34502 3 4.99902 4.346 4.99902 6V20C4.99902 20.369 5.20202 20.708 5.52702 20.882C5.85202 21.056 6.24802 21.037 6.55402 20.832L12 17.202L17.446 20.832C17.613 20.944 17.807 21 18.001 21C18.163 21 18.325 20.961 18.473 20.882C18.798 20.708 19.001 20.369 19.001 20V6C19.001 4.346 17.655 3 16.001 3Z" fill="black" fill-opacity="0.56"/>
</svg>

));

export default BookmarkedIcon;
    