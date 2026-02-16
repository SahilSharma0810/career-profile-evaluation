
import React, { useEffect, useState, forwardRef, type ComponentType } from 'react';


export function withGlobalStore(Component): ComponentType {
  return forwardRef((props, ref) => {

    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
      const isOnlineMbaNewPage = localStorage.getItem(
        'is_online_mba_new_page'
      );
      if (isOnlineMbaNewPage === 'true') {
        setShouldShow(true);
      } else {
        setShouldShow(false);
      }
    }, []);

    return <Component {...{ ref }} {...props} />;
  });
}
