import React from 'react'
import { ICON_CLASS, ICON_MAP } from '@/utils/SpendingUtils/TransactionsIconUtils'

const TransactionsIcon = ({ type, size = 20 }) => {
  const IconComponent = ICON_MAP[type] || ICON_MAP.none;
  const classname = ICON_CLASS[type] || '';
  return (
      <div className={classname}>
          <IconComponent size={size} />
          
      </div>
  );
}

export default TransactionsIcon;