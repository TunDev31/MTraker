import React from 'react'
import { ICON_CLASS, ICON_COLOR, ICON_MAP } from '@/utils/SpendingUtils/TransactionsIconUtils'
import { cn } from '@/lib/utils';

const TransactionsIcon = ({ type, size = 20 ,custom=""}) => {
  const IconComponent = ICON_MAP[type] || ICON_MAP.none;
  const classname = ICON_CLASS[type] || '';
  const color = ICON_COLOR[type];
  return (
      <div className={cn(classname,custom)}>
          <IconComponent size={size}  color={color}/>
          
      </div>
  );
}

export default TransactionsIcon;