
import * as React from 'react';

const WeatherNightIcon = React.forwardRef(({ title, titleId, ...props }, ref) => (
  <svg ref={ref} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.502 4.26483C15.302 5.65083 15.671 7.31583 15.424 9.07983C14.969 12.3328 12.332 14.9688 9.08001 15.4238C7.31501 15.6708 5.65101 15.3018 4.26601 14.5018C3.87301 14.2758 3.39701 14.6758 3.55201 15.0998C4.97401 18.9728 8.97901 21.5988 13.481 20.8818C17.244 20.2818 20.282 17.2428 20.882 13.4788C21.599 8.97683 18.974 4.97283 15.101 3.55183C14.676 3.39583 14.276 3.87283 14.502 4.26483Z" fill="black" fill-opacity="0.56"/>
</svg>

));

export default WeatherNightIcon;
    