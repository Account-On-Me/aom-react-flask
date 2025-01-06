export const ThinScrollBarCSS = {
  '&::-webkit-scrollbar': {
    'width': '6px',
    'height': '6px',
    'background': 'lightgray'
  },
  '&::-webkit-scrollbar-track': {
    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,255,1)',
    'border-radius': '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    'border-radius': '15px',
    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.5)',
    'background': '#1976d2'
} 
}