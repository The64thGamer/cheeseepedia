export function timeAgo(unixSeconds) {
  if(!unixSeconds) return '';
  const now   = Date.now() / 1000;
  const diff  = Math.floor(now - unixSeconds);
  if(diff < 0)        return 'just now';
  if(diff < 60)       return 'just now';
  if(diff < 3600)     { const m=Math.floor(diff/60);   return `${m} minute${m!==1?'s':''} ago`; }
  if(diff < 86400)    { const h=Math.floor(diff/3600);  return `${h} hour${h!==1?'s':''} ago`; }
  if(diff < 7*86400)  { const d=Math.floor(diff/86400); return `${d} day${d!==1?'s':''} ago`; }
  if(diff < 30*86400) { const w=Math.floor(diff/604800);return `${w} week${w!==1?'s':''} ago`; }
  if(diff < 365*86400){ const mo=Math.floor(diff/2592000);return `${mo} month${mo!==1?'s':''} ago`; }
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
}