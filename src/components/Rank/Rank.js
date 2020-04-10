import React from 'react';

const Rank = ({ nameProxy, entriesProxy }) => {
  return (
    <div>
      <div className='white f3'>
          {`${nameProxy}, your current entry count is...`}
      </div>
      <div className='white f1'>
          {entriesProxy}
      </div>
    </div>
    );
  }

  export default Rank;